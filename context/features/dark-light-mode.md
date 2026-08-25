# Feature Spec: Dark / Light Mode + Persisted Preferences

## Metadata

| Field | Value |
|---|---|
| Status | **done** (branch `feat/dark-light-mode`) |
| Priority | P1 |
| Depends on | [refactor-foundation.md](./refactor-foundation.md) recommended — especially resolving B2 (dead gradient ternary at `page.tsx:147`) which this spec replaces |
| Resolves | T4 fully, B2 properly |
| New dependencies | none |

> **Implementation notes (2026-08-25):** Tailwind v4 class strategy via `@custom-variant dark` in globals.css. Gradients live in `src/utils/getWeatherGradient.ts` — every class is a **literal string** (incl. its `dark:` twin) because Tailwind's compiler can't see dynamically-built names; verified emitted classes in built CSS. Theme applied pre-paint by an inline script in layout (`weather.theme`, JSON-encoded); `ThemeSync` keeps `.dark` on `<html>` in sync and live-follows OS changes while mode = system. Navbar cycles Sun→Moon→Monitor (light→dark→system). Skeleton uses the current city's condition gradient; error card uses Clear default. Glass surfaces/text needed no overrides (white-alpha works on both). Contrast note: lightest gradient stops stay ≥ sky-200/sky-300 tier matching the original amber-300 baseline for white text.

## Summary

Add a proper theme system using Tailwind v4 CSS-first tokens: light/dark palettes defined once in `globals.css`, toggled by a `dark` class on `<html>`, persisted via jotai. While touching persistence, also persist the existing °C/°F preference (currently resets every load). Default follows `prefers-color-scheme`.

## User Stories

- As a user checking weather at night, I want a dark UI that doesn't blind me.
- As a returning user, I want my theme AND temperature unit remembered.
- As a first-time visitor, I want the app to match my OS preference automatically.

## Technical Design

### Tailwind v4 theming (`src/app/globals.css`)

Tailwind v4 is CSS-first. Define semantic tokens and dark variants:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-surface: oklch(1 0 0 / 0.1);
  /* map glass tokens used across app */
}

/* OR simpler: keep utility classes, add .dark overrides for the few themed pieces */
```

**Chosen strategy (minimal diff): keep the existing white-alpha glass classes for light mode and add targeted `.dark:` variants where colors must flip.** The app's palette is small: page gradient background, text opacities, glass surfaces. Concretely:

- Page gradient (`page.tsx:147`): replace B2's dead ternary with a helper `getWeatherGradient(condition)` returning light gradient classes, plus `dark:` equivalents (deep navy/slate: `from-slate-900 via-indigo-950 to-slate-900` etc. per condition family: Clear/Clouds/Rain/Snow/Extreme).
- Glass surfaces: components accept the same utilities with `dark:bg-white/10` already fine on dark; adjust borders `dark:border-white/15`.
- Text: existing white-opacity text works on dark; light mode needs `text-black/70`-style overrides — introduce tokens only where needed instead of mass-rewriting (audit during step 3).

### State changes (`src/app/atom.ts`)

```ts
import { atomWithStorage } from "jotai/utils";

export type Theme = "light" | "dark" | "system";
export const themeAtom = atomWithStorage<Theme>("weather.theme", "system");
export const isCelsiusAtom = atomWithStorage<boolean>("weather.isCelsius", true); // migrate existing atom
```

### Class application

New tiny client component `src/components/ThemeSync.tsx` mounted in `layout.tsx` body:

- Reads `themeAtom`; computes effective theme (`system` → `window.matchMedia("(prefers-color-scheme: dark)")`).
- Adds/removes `dark` class on `document.documentElement`; subscribes to OS changes while mode = system.
- `<html suppressHydrationWarning>` in layout to avoid mismatch flash; optionally inline pre-hydration script setting class from localStorage key `weather.theme` to prevent FOUC.

### UI changes

- Theme toggle button group in Navbar next to unit toggle (`Navbar.tsx:132-137` zone): Sun/Moon/Monitor icons (`lucide-react`: `Sun`, `Moon`, `Monitor`) cycling light→dark→system; `aria-label="Theme: {mode}"`.
- Unit toggle unchanged except now persisted.

## Files to Create

```
src/components/ThemeSync.tsx     // applies .dark class, listens to system changes
```

## Files to Modify

| File | Area | Change |
|---|---|---|
| `src/app/globals.css` | whole file | `@custom-variant dark`, token definitions, hoisted `.scrollbar-hide`/`.pb-safe` (if refactor hasn't yet) |
| `src/app/layout.tsx` | :26-49 | `suppressHydrationWarning` on `<html>`, mount `<ThemeSync />`, restore metadata title/description |
| `src/app/atom.ts` | whole file | themeAtom; convert isCelsius to atomWithStorage |
| `src/components/Navbar.tsx` | :126-137 | add theme cycle button |
| `src/app/page.tsx` | :146-153 | replace dead ternary (B2) with condition→gradient helper incl. dark variants |

## Implementation Steps

1. [ ] Convert `isCelsiusAtom` to `atomWithStorage` (same key name used everywhere; old non-persisted users simply get default true once).
2. [ ] Add `themeAtom` + `ThemeSync.tsx`; wire layout (`suppressHydrationWarning`, mount component).
3. [ ] Audit color usage: list every hardcoded white/black-ish class; decide which need `dark:` twins. Fix text-on-light issues introduced by lighter gradients.
4. [ ] Implement `getWeatherGradient()` util (`src/utils/getWeatherGradient.ts`) replacing `page.tsx:147` ternary; include dark variants per condition family.
5. [ ] Add Navbar theme-cycle button with three lucide icons.
6. [ ] Restore metadata export in `layout.tsx` (title "Weather App", sensible description).
7. [ ] Contrast pass: check text ≥ 4.5:1 against all gradients in both themes (quick Lighthouse/aXe run).

## Acceptance Criteria

- [ ] Toggle cycles light → dark → system; icon reflects current mode.
- [ ] Refresh keeps chosen theme (localStorage `weather.theme`) and unit (`weather.isCelsius`).
- [ ] System mode live-follows OS change without refresh.
- [ ] No flash of wrong theme on load (pre-hydration script works).
- [ ] All five sections (hero, details tiles, hourly, daily, footer) readable in both themes; skeleton matches theme.
- [ ] Gradient varies by weather condition (Clear ≠ Rain) — B2 verified dead.

## Verification Checklist

```bash
npm run lint && npm run build && npm run dev
```
Manual: cycle modes; emulate `prefers-color-scheme` in DevTools; clear localStorage → defaults to OS scheme; test search/skeleton/footer in dark.

## Out of Scope

- Multiple accent themes / high-contrast mode
- Auto theme-by-time-of-day (e.g. dark after sunset based on sunrise/sunset data — good future idea)
- Re-skinning emoji icons per theme (T6 decision covers icons separately)
