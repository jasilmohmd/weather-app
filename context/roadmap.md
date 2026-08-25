# Roadmap

Statuses: `planned` → `in-progress` → `done`. Update this table whenever a feature ships. Specs live in [`features/`](./features/).

| # | Feature | Priority | Status | Spec | Depends on | Resolves |
|---|---|---|---|---|---|---|
| 1 | Refactor foundation (types/services/hooks, split page.tsx, QueryClient+queryKey fixes) | **P0** | **done** (branch `refactor/foundation`) | [refactor-foundation.md](./features/refactor-foundation.md) | — | B1-B5, A1-A5, S1, T1-T4 |
| 2 | Favorites & recent cities | P1 | **done** (branch `feat/favorites-recent-cities`) | [favorites-recent-cities.md](./features/favorites-recent-cities.md) | #1 ✅ | — |
| 3 | Dark / light mode + persisted preferences | P1 | **done** (branch `feat/dark-light-mode`) | [dark-light-mode.md](./features/dark-light-mode.md) | #1 ✅ | T4 done, B2 done properly |
| 4 | AQI + weather charts + radar map | P2 | **done** (branch `feat/aqi-weather-maps`) | [aqi-weather-maps.md](./features/aqi-weather-maps.md) | #1 ✅ | — |

## Recommended order

**#1 first.** Every other spec assumes the service layer (`src/services/weatherApi.ts`), shared types (`src/types/weather.ts`), and the fixed queryKey pattern. Building features on the monolith multiplies rework.

After #1, #2 and #3 are independent of each other — pick by preference. #4 last (new dependency + new endpoint).

## Backlog (unspec'd ideas)

Add a spec via [`TEMPLATE.md`](./features/TEMPLATE.md) before starting any of these:

- ~~Debounced autocomplete + keyboard-navigable suggestions~~ ✅ done — [`features/search-a11y.md`](./features/search-a11y.md)
- Full ARIA combobox wiring on the search input (aria-expanded/activedescendant) — follow-up to search-a11y
- ~~Route-handler proxy hiding the OWM key server-side~~ ✅ done — [`features/key-proxy.md`](./features/key-proxy.md); follow-up: proxy rate-limiting/caching
- ~~Hourly forecast expansion~~ ✅ done — `feat/hourly-expansion` (24 slots, scroll-snap, day-change markers)
- i18n (date-fns locales already in tree)
- ~~PWA manifest + offline shell~~ ✅ done — [`features/pwa.md`](./features/pwa.md) (follow-ups: PNG icons, offline banner)
- ~~Test suite (Vitest + React Testing Library)~~ ✅ done — `chore/test-suite`; remaining: route `error.tsx`, Prettier
- Adopt OWM PNG icons or keep emojis — decide once (T6)
- ~~Code-split recharts via next/dynamic~~ ✅ done — `chore/code-split-recharts` (/ page chunk 155 kB → 49 kB)

## Changelog

| Date | Change |
|---|---|
| 2026-08-25 | Initial review; context folder created; roadmap seeded with 4 specs |
| 2026-08-25 | PR #1 (`fix/remove-hardcoded-api-key`): S1 source fix + `.env.example` |
| 2026-08-25 | `refactor/foundation`: spec #1 implemented — types/services/hooks extracted, page split, B1–B5/A1–A5/T1–T4 fixed, metadata restored |
| 2026-08-25 | `feat/favorites-recent-cities`: spec #2 implemented — persisted saved/recent places, chips bar, pin button; branching rule added to agent protocol |
| 2026-08-25 | `feat/dark-light-mode`: spec #3 implemented — class-based dark variant, per-condition gradients (light+dark), theme cycle button, FOUC script, persisted theme/units |
| 2026-08-25 | `feat/aqi-weather-maps`: spec #4 implemented — AQI tile (Air Pollution API), recharts temp/precip trends, collapsible Windy radar embed |
| 2026-08-25 | `feat/search-debounce-keyboard`: backlog item — 300 ms debounced autocomplete with stale guard, keyboard-accessible suggestions, a11y labels batch |
| 2026-08-25 | `feat/server-key-proxy`: S2 resolved — /api route handlers + private WEATHER_API_KEY; client bundle verified key-free |
| 2026-08-25 | `chore/hygiene-t5-t8`: T5–T8 resolved — lucide-only icons (react-icons dropped), ESM next.config, utils renamed per filename==export convention |
| 2026-08-25 | `chore/test-suite`: Vitest 4 + RTL + jsdom wired with @ alias; 39 tests over utils + WeatherIcon; `npm test` / `npm run test:watch` |
| 2026-08-25 | `chore/error-boundaries-prettier`: T9 fully closed — error.tsx + not-found.tsx route boundaries; Prettier 3 configured and repo formatted |
| 2026-08-25 | `chore/code-split-recharts`: ForecastCharts loaded via next/dynamic with pulse skeleton — / page chunk 155 kB → 49 kB |
| 2026-08-25 | `feat/hourly-expansion`: hourly strip widened to 24 slots with scroll-snap and weekday markers on day change; +5 tests |
| 2026-08-25 | `feat/pwa`: installable PWA — webmanifest, SVG icon, hand-rolled service worker (offline shell for navigations/static/API), prod-only registration |
