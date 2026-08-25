# Known Issues & Tech Debt

Review date: 2026-08-25 @ commit `0f97960`. Line numbers refer to current source. Fix owners: any agent touching the relevant file should fix-and-check-off items marked 🔧; structural items are bundled into [`features/refactor-foundation.md`](./features/refactor-foundation.md).

Legend: 🐛 user-visible bug · ⚠️ anti-pattern/degradation · 🔒 security · 🧹 hygiene · ♿ accessibility

---

## Bugs

### B1 🐛 Sunrise/sunset values swapped
`sunset=` receives `data.city.sunrise` (copy-paste). Two occurrences:
- `src/app/page.tsx:222-223` — `sunrise={safeFormatUnix(data.city.sunrise…)} sunset={safeFormatUnix(data.city.sunrise…)}`
- `src/app/page.tsx:282-283` — same duplication in the forecast row

Fix: second call must pass `data.city.sunset`. One-line each.

### B2 🐛 Dead gradient ternary
`src/app/page.tsx:147`: all three branches of the weather-condition gradient ternary return the identical class list (`from-amber-300 via-orange-400 to-red-400`). Either implement distinct gradients per condition (Clear / Clouds / else) or collapse the expression. Related dark-mode spec will replace this logic entirely.

### B3 🐛 Single search suggestion never displays
`src/components/Navbar.tsx:203`: dropdown renders only when `suggestions.length > 1`. A unique exact match (e.g. typing full city name) hides its own suggestion, so submitting relies on the raw input text instead of the canonical city name.

Fix: condition should be `(showSuggestions && suggestions.length >= 1) || error`.

### B4 🐛 Inconsistent rounding between units
`src/utils/convertKelvinToCelcius.ts` — `convertKtoC` uses `Math.floor` (:3) but `convertKtoF` uses `Math.round` (:7). Toggling units shows different rounding behavior (e.g. 19.9° renders 19 C but 20 F).

Fix: use `Math.round` for both (or both floor) — pick one and apply everywhere temps render.

### B5 🐛 Misleading heading/comment mismatch
`src/app/page.tsx:262` comment says "7 day forecast"; heading at :265 says "5-Day Forecast"; actual slice at :267 is `.slice(1,6)` = 5 days (today excluded). Cosmetic: align comment+heading with behavior.

## Anti-patterns

### A1 ⚠️ QueryClient recreated every render
`src/app/layout.tsx:32` — `const queryClient = new QueryClient()` runs on each render of RootLayout. Fix (standard pattern):
```ts
const [queryClient] = useState(() => new QueryClient())
```

### A2 ⚠️ Refetch-via-useEffect instead of queryKey
`src/app/page.tsx:112-114` refetches when `place` changes while the queryKey stays `'repoData'` (:102). This defeats caching/dedup/background-refetch and can race. Fix: `queryKey: ['weather', 'forecast', place]` and delete the effect.

### A3 ⚠️ Artificial setTimeout delays around city switching
`Navbar.tsx:79-82` (geolocation flow) and `:105-109` (submit flow) wrap `setPlace` in `setTimeout(...,1000)` purely so the skeleton shows. Replace with real async loading states once A2 lands (React Query's `isFetching` covers it).

### A4 ⚠️ Geolocation has no failure handling
`Navbar.tsx:69` passes only a success callback to `getCurrentPosition` — permission-denied/unavailable silently does nothing; catch at `:84-87` just `console.log`s network errors. Add the error callback + surface a message like the SuggestionBox error path.

### A5 ⚠️ Unstyled raw error string
`src/app/page.tsx:144` returns `'An error has occurred: ' + error.message`. Replace with a styled error card; ideally add `app/error.tsx` boundary (refactor R9).

### A6 ⚠️ Autocomplete fires per keystroke
No debounce on `handleInputChange` (`Navbar.tsx:29-59`) → burns OWM rate limit while typing. Debounce ~300ms when touching search.

## Security

### S1 🔒 API key hardcoded in source comment
`src/app/page.tsx:22` contains a full URL including the live key. Delete the line. Also verify the key isn't in git history (`git log -p | grep appid=`); rotate in OWM dashboard if it ever was public. Tracked as refactor step R8 alongside adding `.env.example`.

### S2 🔒 Key ships to browser by design
`NEXT_PUBLIC_WEATHER_KEY` is embedded in the client bundle. Acceptable short-term for a hobby app; long-term fix is a Next.js route handler proxy with a private key (optional hardening task, not scheduled).

## Tech Debt / Structure

### T1 🧹 455-line monolith page
`src/app/page.tsx` mixes: OWM type definitions (:24-91), API call (:101-110), data derivation (:116-135), entire home UI (:146-317), and a 135-line skeleton (:320-455). Decomposition plan = refactor spec steps R1-R6.

### T2 🔒→🧹 Types imported from a page file
`Navbar.tsx:10` does `import { City, WeatherEntry } from '@/app/page'`. Move interfaces to `src/types/weather.ts` (refactor R1) and repoint imports.

### T3 🧹 Duplicated blocks
- `WeatherSkeleton` styling duplicates Home markup patterns (`page.tsx:320-455`)
- styled-jsx helper block duplicated at `page.tsx:299-310` and `:441-452` → hoist `.scrollbar-hide`/`.pb-safe` into `globals.css`

### T4 🧹 Metadata disabled
`layout.tsx:21-24` metadata export commented out → no `<title>`/description (bad SEO/bookmark UX). Re-enable with proper title during refactor R7.

### T5 🧹 Two icon libraries
`lucide-react` everywhere except `react-icons/io5` (`IoSearch`) in `Searchbox.tsx:3`. Consolidate on lucide when convenient.

### T6 🧹 Unused image config
`next.config.ts:3` whitelists openweathermap.org images that the app never uses (icons are emojis). Either adopt OWM PNG icons (`https://openweathermap.org/img/wn/{icon}@2x.png`) or drop the config.

### T7 🧹 Config style inconsistency
`next.config.ts` uses CommonJS `module.exports` in a TS file; other configs are ESM. Normalize to `export default` / `nextConfig` object pattern.

### T8 🧹 Naming nits
- `convertKelvinToCelcius.ts` — misspelled ("Celcius"); renaming touches imports in `page.tsx` only
- `speedInMpsToKmph.ts` exports `convertSpeed` (filename ≠ function)
- `metersToKilometers.ts:2` local var capitalized `Kilometers`

### T9 🧹 No tests / no error boundary / no Prettier
Zero test files or runner. No `error.tsx`/`not-found.tsx`/`loading.tsx`. No formatter config (only stock ESLint). Adding Vitest + Testing Library is optional future work; error boundary is refactor R9.

## Accessibility Gaps (batch item)

- ♿ Suggestion `<li>`s have onClick but no keyboard support/roles (`Navbar.tsx:208-216`) — needs button semantics or roving tabindex + Enter/Escape/arrows.
- ♿ Icon-only buttons rely on `title` alone (geolocation `Navbar.tsx:122`, unit toggle `:132-137`, search submit `Searchbox.tsx:29`) → add `aria-label`.
- ♿ Search input lacks a label (`Searchbox.tsx:21-27`) → `aria-label="Search location"`.
- ♿ Emoji weather icons convey meaning without text alternative (`WeatherIcon.tsx`) → `role="img"` + `aria-label={condition}`.
