# Roadmap

Statuses: `planned` → `in-progress` → `done`. Update this table whenever a feature ships. Specs live in [`features/`](./features/).

| # | Feature | Priority | Status | Spec | Depends on | Resolves |
|---|---|---|---|---|---|---|
| 1 | Refactor foundation (types/services/hooks, split page.tsx, QueryClient+queryKey fixes) | **P0** | planned | [refactor-foundation.md](./features/refactor-foundation.md) | — | B1-B5, A1-A5, S1, T1-T4 |
| 2 | Favorites & recent cities | P1 | planned | [favorites-recent-cities.md](./features/favorites-recent-cities.md) | #1 recommended | — |
| 3 | Dark / light mode + persisted preferences | P1 | planned | [dark-light-mode.md](./features/dark-light-mode.md) | #1 recommended (B2 gradient logic) | T4 partially |
| 4 | AQI + weather charts + radar map | P2 | planned | [aqi-weather-maps.md](./features/aqi-weather-maps.md) | #1 required (service layer) | — |

## Recommended order

**#1 first.** Every other spec assumes the service layer (`src/services/weatherApi.ts`), shared types (`src/types/weather.ts`), and the fixed queryKey pattern. Building features on the monolith multiplies rework.

After #1, #2 and #3 are independent of each other — pick by preference. #4 last (new dependency + new endpoint).

## Backlog (unspec'd ideas)

Add a spec via [`TEMPLATE.md`](./features/TEMPLATE.md) before starting any of these:

- Debounced autocomplete + keyboard-navigable suggestions (A6, ♿ items)
- Route-handler proxy hiding the OWM key server-side (S2)
- Hourly forecast expansion (24h+ with scroll snap)
- i18n (date-fns locales already in tree)
- PWA manifest + offline shell
- Test suite (Vitest + React Testing Library)
- Adopt OWM PNG icons or keep emojis — decide once (T6)

## Changelog

| Date | Change |
|---|---|
| 2026-08-25 | Initial review; context folder created; roadmap seeded with 4 specs |
