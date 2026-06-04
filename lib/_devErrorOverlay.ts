// Web-only error surface for the Expo preview. Three jobs, all aimed at the rule
// "never a silent white screen, never a frozen tab":
//   1. console.error every uncaught error / unhandled rejection with a [CLIENT ERROR]
//      tag. @expo/metro-runtime (a template dependency) forwards browser console output
//      to the Metro dev-server stdout, where the sandbox monitor captures it — so the
//      build agent can read the real error and fix it before completing.
//   2. Paint the error straight onto the page via raw DOM (works even if React never
//      mounted, e.g. a module-load ReferenceError) so a crash shows the actual message
//      instead of a blank white screen.
//   3. Circuit-breaker for infinite render loops ("Maximum update depth exceeded"):
//      a runaway setState-in-useEffect pegs the CPU so hard the tab can't even be
//      refreshed. After a few rapid hits we set a sessionStorage flag and reload; on the
//      next load we halt BEFORE the app mounts, so the tab stays responsive and shows the
//      error instead of locking up.
// No-op on native and during SSR. Import this once, first, in app/_layout.tsx.

const OVERLAY_ID = '__rb_error_overlay__';
const LOOP_HALT_KEY = '__rb_render_loop_halt__';
const LOOP_HIT_LIMIT = 15; // rapid "Maximum update depth" hits before we trip the breaker

function paint(title: string, detail: string): void {
  try {
    let el = document.getElementById(OVERLAY_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = OVERLAY_ID;
      el.setAttribute(
        'style',
        [
          'position:fixed',
          'inset:0',
          'z-index:2147483647',
          'overflow:auto',
          'background:#1a1a1a',
          'color:#ff6b6b',
          'font:13px/1.5 ui-monospace,Menlo,Consolas,monospace',
          'padding:24px',
          'white-space:pre-wrap',
          'user-select:text',
        ].join(';'),
      );
      document.body.appendChild(el);
    }
    el.textContent = `⚠ App error (fix this and the screen will recover)\n\n${title}\n\n${detail}`;
  } catch {
    /* ignore overlay failures */
  }
}

function report(message: string, stack?: string): void {
  // Tagged so the sandbox monitor classifies it and the agent can find it.
  console.error('[CLIENT ERROR]', stack ? `${message}\n${stack}` : message);
  paint(message, stack || '');
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Circuit-breaker: if the previous load tripped the render-loop guard, halt before the
  // app mounts so this tab never locks up again. One-shot — clear the flag so a manual
  // reload re-attempts the (hopefully fixed) app.
  try {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(LOOP_HALT_KEY)) {
      sessionStorage.removeItem(LOOP_HALT_KEY);
      report(
        'Render loop halted (Maximum update depth exceeded)',
        'The app entered an infinite render loop and was stopped before mounting to keep this tab responsive. ' +
          'A component is calling setState inside a useEffect whose dependency array is missing or contains a ' +
          'value recreated every render. Fix that effect, then reload.',
      );
      // Prevent the buggy app module graph from executing this load.
      throw new Error('[CLIENT ERROR] Render loop halted before mount (see overlay).');
    }
  } catch (e) {
    // Re-throw only our intentional halt; never let sessionStorage access errors break boot.
    if (e instanceof Error && e.message.includes('Render loop halted before mount')) {
      throw e;
    }
  }

  let loopHits = 0;
  const tripBreaker = (): void => {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(LOOP_HALT_KEY, '1');
        // Reload into the safe path above, which halts before mount and frees the CPU.
        window.location.reload();
      }
    } catch {
      /* if we can't reload, the painted overlay below is the fallback */
    }
  };

  window.addEventListener('error', (e: ErrorEvent) => {
    const msg = e?.message || e?.error?.message || 'Uncaught error';
    if (/Maximum update depth exceeded/.test(msg) && ++loopHits >= LOOP_HIT_LIMIT) {
      tripBreaker();
      return;
    }
    report(msg, e?.error?.stack);
  });
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    const r = e?.reason as { message?: string; stack?: string } | undefined;
    report(r?.message || String(r) || 'Unhandled promise rejection', r?.stack);
  });
}

export {};
