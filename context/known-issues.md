# Known Issues & Tech Debt

> **2026-08-25 update:** B1–B5, A1–A5, T1–T4 + S1-source fixed on `refactor/foundation`; A6 + ♿ batch on `feat/search-debounce-keyboard`; S2 on `feat/server-key-proxy`; T5–T8 on `chore/hygiene-t5-t8`; tests on `chore/test-suite`; **T9 fully closed** (error boundaries + Prettier) on `chore/error-boundaries-prettier`. Entries kept for reference; ✅ headings are resolved. **Ledger is clean — no open items.** Remaining ideas live in the roadmap backlog.

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
`src/utils/convertKelvinToCelsius.ts (renamed from ...Celcius.ts)` — `convertKtoC` uses `Math.floor` (:3) but `convertKtoF` uses `Math.round` (:7). Toggling units shows different rounding behavior (e.g. 19.9° renders 19 C but 20 F).

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

## Security

### S1 🔒 API key hardcoded in source comment
`src/app/page.tsx:22` contains a full URL including the live key. Delete the line. Also verify the key isn't in git history (`git log -p | grep appid=`); rotate in OWM dashboard if it ever was public. Tracked as refactor step R8 alongside adding `.env.example`.

### S2 🔒 Key ships to browser by design — FIXED (feat/server-key-proxy)
Resolved by routing all OWM traffic through `/api/*` route handlers with a private `WEATHER_API_KEY`; see [`features/key-proxy.md`](./features/key-proxy.md). Client bundle verified free of the key value, the OWM host string, and the legacy env name. Remaining optional hardening: proxy rate-limiting/caching.

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

### T5 ✅🧹 Two icon libraries — FIXED
Consolidated on lucide-react; `react-icons` dependency removed (Searchbox uses lucide `Search`).

### T6 ✅🧹 Unused image config — RESOLVED
Decision made: keep emoji icons (now a11y-labeled). The unused `images.remotePatterns` whitelist was removed. If OWM PNG icons are ever adopted, re-add it.

### T7 ✅🧹 Config style inconsistency — FIXED
`next.config.ts` now uses the standard ESM `NextConfig` typed default export; unused image config dropped with it.

### T8 ✅🧹 Naming nits — FIXED
- `convertKelvinToCelcius.ts` → `convertKelvinToCelsius.ts` (spelling)
- `speedInMpsToKmph.ts` → `convertSpeed.ts` (filename now matches its export, like the other utils)
- `metersToKilometers.ts` local `Kilometers` → `kilometers`
All imports repointed; grep-clean.

### T9 ✅🧹 Tests / error boundary / Prettier — FULLY RESOLVED
- ✅ Test suite (`chore/test-suite`): Vitest 4 + RTL + jsdom; 39 tests (`npm test`)
- ✅ Route boundaries (`chore/error-boundaries-prettier`): `src/app/error.tsx` (client boundary w/ retry + digest) and `src/app/not-found.tsx` (404 page)
- ✅ Prettier 3: `.prettierrc` (singleQuote, printWidth 100, es5 commas), `.prettierignore` excludes md/.next/lockfile; `npm run format` / `format:check`; repo formatted once in the same PR

### A6 ✅⚠️ Autocomplete fires per keystroke — FIXED
300 ms debounce + stale-response sequence guard + unmount cleanup in `Navbar.tsx`. See `features/search-a11y.md`.

## Accessibility Gaps — FIXED (feat/search-debounce-keyboard)

- ♿ ✅ Suggestions are `role="listbox"`/`role="option"` buttons with ↑/↓/Enter/Escape keyboard support.
- ♿ ✅ All icon-only buttons carry aria-labels (geolocation, unit toggle, pin, theme, chips, search submit).
- ♿ ✅ Search input has `aria-label="Search location"`.
- ♿ ✅ Weather icons are `role="img"` with readable condition names per OWM code (`ICON_NAMES` in WeatherIcon.tsx).
- Future polish: full ARIA combobox wiring (`aria-expanded`/`aria-activedescendant` on the input).
