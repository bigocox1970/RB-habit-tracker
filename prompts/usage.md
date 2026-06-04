# Usage — Expo React Native Template

## Stack
- Expo SDK 54, expo-router (file-based routing), TypeScript
- React Native + react-native-web (same code runs on iOS, Android, and browser)
- No Tailwind — use React Native StyleSheet API for all styling

## ⚠️ CRITICAL — a broken bundle = SILENT BLANK WHITE SCREEN. Code MUST compile.
This renders to web via Metro. **If ANY file fails to compile, Metro returns a 500 and the user sees a blank white page with no error shown.** The bar: every file compiles cleanly.
- **Declare each identifier exactly ONCE per scope.** Never define `formatX` and then `const formatX = ...` again in the same file — duplicate `const`/`function`/`let` is a hard compile error → white screen.
- No leftover/half-edited code: delete dead reassignments and unused locals; never leave a second definition "just in case".
- Valid TypeScript: every imported name must exist and be exported; no references to undeclared variables.
- After writing or editing a file, re-read it and confirm it compiles (imports resolve, no duplicate declarations, balanced braces) BEFORE moving on.

## Expo Router rules (canonical — from Expo docs, follow exactly)
- `app/` is **ONLY for routes**. Each file = one page and **MUST have a `default export`** React component. A route file with no default export breaks that route.
- `app/index.tsx` is the **entry screen** (`/` route) — it renders first. To change the home screen, edit THIS file.
- `app/_layout.tsx` renders before any route (providers, fonts, navigators). Register new screens here.
- **Put non-route code OUTSIDE `app/`** (components, hooks, contexts, lib, types, data). A non-route file inside `app/` is treated as a route and errors.
- Refs: docs.expo.dev/router/basics/core-concepts • docs.expo.dev/workflow/common-development-errors

## File structure
- `app/` — screens (file-based routing, like Next.js). Each file = one screen.
- `app/_layout.tsx` — root layout (Stack navigator). Add screens here.
- `app/index.tsx` — home screen (route: `/`)
- `components/` — shared UI components
- `constants/Colors.ts` — colour palette
- Put non-screen code (components, hooks, stores, lib, types) wherever you like — either at the project root (`components/`, `hooks/`, `lib/`) OR under `src/` (`src/components/`, `src/hooks/`, `src/lib/`). Pick ONE convention and keep every file consistent with it.

## Imports (CRITICAL — avoids "Unable to resolve module")
- ALWAYS import internal modules with the `@/` path alias, NEVER with fragile relative paths like `../../hooks/x` or `../src/lib/y`. The `@/` alias resolves to BOTH the project root AND `src/`, so it works no matter which convention you chose:
  ```tsx
  import { useHabits } from '@/hooks/useHabits';   // resolves hooks/ OR src/hooks/
  import { storage } from '@/lib/storage';          // resolves lib/ OR src/lib/
  import { Habit } from '@/types/habit';            // resolves types/ OR src/types/
  ```
- The ONE exception is `assets/` (fonts/images) which must use a real relative path (see Fonts & assets below).
- Because `@/` covers both root and `src/`, you never need to guess `../` depth and import paths can't drift out of sync with where you placed the file. Be consistent: if `@/store/habitStore` is the import, the file must exist at exactly `store/habitStore.ts` OR `src/store/habitStore.ts`.
- **Named imports must match named exports (CRITICAL — silent blank-white-screen otherwise).** A `import { Colors } from '@/constants/Colors'` (named) resolves to `undefined` if `Colors.ts` only has `export default` — then `Colors.textSecondary` throws "Cannot read properties of undefined" at runtime with NO compile error. `constants/Colors.ts` is imported as `import { Colors }` everywhere, so it MUST keep `export const Colors = {...}` (a named export). You may change the colour VALUES, but NEVER convert it to a default-only export. The same rule applies to any shared module: if files import it by name, it must export that name.

## Routing (CRITICAL)
Uses expo-router (file-based). To add a new screen:
1. Create `app/my-screen.tsx`
2. Navigate with `router.push('/my-screen')` or `<Link href="/my-screen">`
3. Add a `<Stack.Screen name="my-screen" options={{ title: 'My Screen' }} />` in `_layout.tsx`

```tsx
// Navigation example
import { Link } from 'expo-router';
<Link href="/my-screen">Go to screen</Link>
```

## Styling
- ALWAYS use `StyleSheet.create({})` — never inline object styles in JSX
- Use `flex: 1` on containers for full height
- Use `Platform.OS` to branch iOS vs Android behaviour if needed

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});
```

## Components
- Use React Native primitives: `View`, `Text`, `TouchableOpacity`, `TextInput`, `ScrollView`, `FlatList`, `Image`
- No HTML elements (no `<div>`, `<span>`, `<p>`) — this is React Native, not React DOM
- No CSS classes or Tailwind — only StyleSheet

## Data persistence & IDs (CRITICAL — read before writing storage code)
- For local storage use `@react-native-async-storage/async-storage` — it is ALREADY installed. Do NOT reinstall it.
  ```tsx
  import AsyncStorage from '@react-native-async-storage/async-storage';
  await AsyncStorage.setItem('key', JSON.stringify(value));
  const raw = await AsyncStorage.getItem('key');
  ```
- For unique IDs ALWAYS use `crypto.randomUUID()` — no dependency needed. It is safe on web AND native: `lib/crypto-polyfill.ts` (imported first in `app/_layout.tsx`) installs `crypto.randomUUID` on the native Hermes runtime, which lacks it by default. Do NOT add `nanoid` or `uuid` (they need native/ESM resolution that breaks Metro), and do NOT remove the polyfill import.
  ```tsx
  const id = crypto.randomUUID();
  ```

## Fonts & assets (CRITICAL — avoids "Unable to resolve module ...ttf/.png")
- Prefer SYSTEM fonts — just set `fontFamily`/`fontWeight` in StyleSheet. No setup, never breaks.
- The ONLY bundled font file is `assets/fonts/SpaceMono-Regular.ttf`. If you use `useFonts`, you may ONLY `require('../assets/fonts/SpaceMono-Regular.ttf')` (it exists). Example:
  ```tsx
  import { useFonts } from 'expo-font';
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  ```
- NEVER `require()` an image, font, or other asset file that you have not actually created in the project. Metro fails the whole app with "Unable to resolve module" / "None of these files exist". There are NO bundled images, icons, or splash assets — use remote `{ uri }` images instead.

## Icons (CRITICAL — `@expo/vector-icons` renders as BLANK BOXES on web, do not use it)
- The preview is react-native-web. `@expo/vector-icons` (Ionicons, MaterialIcons, etc.) load an icon FONT whose glyphs do NOT render in this web preview — they show as empty/blank squares even though the app compiles. DO NOT use `@expo/vector-icons` for any icon (tab bars, buttons, cards).
- ALWAYS use **emoji** inside a `<Text>` for icons — they render reliably on web, iOS and Android with zero setup:
  ```tsx
  <Text style={{ fontSize: 22 }}>💧</Text>   // water   🔥 streak  📅 history  ⚙️ settings  📊 stats  ✅ done  ➕ add
  ```
- For tab bar icons, return an emoji `<Text>` from `tabBarIcon`:
  ```tsx
  <Tabs.Screen name="index" options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💧</Text> }} />
  ```
- If you need crisp vector icons later, inline an SVG with `react-native-svg` — but emoji is the default and always works.

## Adding other dependencies
- If you import a package that is NOT already in package.json, you MUST install it FIRST in the same step, before or together with the code that imports it. Otherwise the Metro bundler fails with "Unable to resolve module".
- Install with `bun add <package>` via the command tool — do NOT hand-edit package.json (it is protected).
- Prefer Expo-maintained packages (`expo-*`) and pure-JS libraries.

## DO NOT
- Use HTML elements (`div`, `span`, `p`, `button`)
- Use CSS files or className props
- Install packages that require native build steps (camera, bluetooth, biometrics) — they won't work in web preview
- `require()` any asset file (font/image) that does not exist in the project — it breaks the entire app. Only `assets/fonts/SpaceMono-Regular.ttf` is bundled
- Modify `babel.config.js`, `metro.config.js`, `tsconfig.json`, `package.json` unless adding a new dependency
- Change the `main` field in package.json — it must stay `expo-router/entry`
