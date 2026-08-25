# Conventions

Follow these when writing any code in this repo. When existing code and this doc disagree, match the **dominant pattern in neighboring files** and flag the doc for update.

## File Naming

| Kind | Pattern | Examples |
|---|---|---|
| Components | PascalCase `.tsx`, one component per file | `Navbar.tsx`, `WeatherIcon.tsx` |
| Utils/helpers | camelCase `.ts` (function-named after what they do) | `metersToKilometers.ts`, `safeFormat.ts` |
| App Router files | Next.js lowercase convention | `page.tsx`, `layout.tsx`, `globals.css` |
| State atoms | `atom.ts` colocated in `src/app/` (today) — new persistent atoms may live in a feature-scoped file | |
| Types | Currently inside `page.tsx`; target location per refactor spec is `src/types/weather.ts` | |

## Exports

- Components: **default export** (`export default function Navbar(...)`)
- Secondary/internal components in the same file: named export if reused (`CompactWeatherDetails` in `WeatherDetails.tsx`) or file-private (`SuggestionBox` in `Navbar.tsx`)
- Utils: named exports of plain functions
- Props type: local `type Props = {...}` (private) or exported `interface XxxProps {...}` when shared across files

## TypeScript

- `strict: true`. No `any` in current code — keep it that way.
- Use `unknown` + narrowing for caught errors (`catch (error: unknown)` then `axios.isAxiosError(error)` / `instanceof Error`).
- Optional-chained data with magic fallbacks is an accepted pattern here: `firstdata?.main.temp ?? 273.15` (Kelvin default), `?? "01d"` icon.
- Import types via the alias: `import { City } from '@/app/page'` today → `@/types/weather` after refactor.

## Styling

- Tailwind utility strings inline; long strings are normal here — don't extract CSS unless it's duplicated (then move to `globals.css`).
- Reuse the glass-card recipe via `<Container>` before hand-rolling `bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl`.
- White-opacity text scale for hierarchy: `text-white/90 … text-white/30`; body text is `font-light`.
- Spacing/layout idiom: `max-w-7xl mx-auto px-3` wrappers; sections separated by `gap-6`.
- `cn()` helper available at `@/utils/cn` — use it when conditionally merging classes.
- styled-jsx blocks only for pseudo-class helpers (`.scrollbar-hide`, `.pb-safe`) — and these are slated to move to `globals.css` in the refactor.

## Data Formatting Rules

- Parents format; children render. Unit conversions happen in the parent via utils:
  - Kelvin → °C: `convertKtoC` · Kelvin → °F: `convertKtoF`
  - m/s → km/h string: `convertSpeed`
  - meters → km string: `metersToKilometers`
  - unix → display time: `safeFormatUnix(unix, "h:mm a")`
  - ISO-ish `dt_txt` → display date/day: `safeFormat(str, "dd MMM" | "EEEE" | "h a")`
  - day/night emoji pick: `getDayOrNightIcon(iconCode, dt_txt)`
- Never throw on bad dates — use the safe* wrappers.

## State Rules

- Global UI state → Jotai atoms in `src/app/atom.ts`.
- Server/weather data → TanStack Query only; never copy query results into useState/atoms.
- New persisted preferences (favorites, units, theme) → jotai `atomWithStorage` from `jotai/utils`.

## Error Handling

- Network calls: try/catch; narrow with `axios.isAxiosError`; surface messages to UI (see Navbar SuggestionBox error rendering) — do NOT just `console.log`.
- Render-level errors: currently unhandled (no `error.tsx`). Adding one is part of refactor spec R9.

## Do / Don't

**Do**
- Default-export components; name files exactly like the component.
- Keep `'use client'` at top of any component using hooks/atoms/events.
- Prefer `??` fallbacks consistent with existing defaults (273.15 K, `"01d"`).
- Run `npm run lint && npm run build` before finishing.
- Update `known-issues.md`/`roadmap.md` statuses as part of your change.

**Don't**
- Don't introduce a second state library or fetcher (no redux/zustand/swr/react-query duplicates).
- Don't add another icon library — use `lucide-react` (the stray `react-icons` import in Searchbox is legacy).
- Don't hardcode the API key anywhere (it already leaked into a comment once — see known-issue T2).
- Don't add artificial `setTimeout` delays; model loading with real async state instead.
- Don't import types from `@/app/page` in NEW code — create/import from `src/types/weather.ts` if it exists (refactor spec), else follow current pattern temporarily.
- Don't add comments narrating obvious code; this codebase keeps comments sparse and purposeful.
