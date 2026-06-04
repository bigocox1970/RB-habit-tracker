/**
 * crypto.randomUUID polyfill for native (Hermes).
 *
 * react-native-web provides `crypto.randomUUID` in the web preview, but the native
 * Hermes runtime in Expo Go does NOT — calling it throws "crypto.randomUUID is not a
 * function" and crashes any handler that generates an ID (a silent Unhandled Promise
 * Rejection on device). This installs a dependency-free RFC4122 v4 generator so code
 * can safely call `crypto.randomUUID()` on web AND native.
 *
 * Imported first in app/_layout.tsx, before any route runs. Math.random based: fine for
 * local entry IDs, not for cryptographic use.
 */
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const scope = globalThis as unknown as { crypto?: { randomUUID?: () => string } };
if (!scope.crypto) {
  scope.crypto = { randomUUID: uuidv4 };
} else if (typeof scope.crypto.randomUUID !== 'function') {
  scope.crypto.randomUUID = uuidv4;
}

export {};
