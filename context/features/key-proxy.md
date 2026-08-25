# Feature Spec: Server-Side Key Proxy (S2)

## Metadata

| Field | Value |
|---|---|
| Status | **done** (branch `feat/server-key-proxy`) |
| Priority | P1 (security) |
| Depends on | refactor-foundation (service layer) |
| Resolves | S2 (key shipped to every visitor's bundle) |
| New dependencies | none |

## Summary

The OpenWeatherMap key no longer reaches the browser. All OWM traffic goes through three Next.js route handlers that inject a **private** `WEATHER_API_KEY` server-side. The public service layer (`src/services/weatherApi.ts`) keeps identical function signatures, so hooks/components needed zero changes.

## Architecture

```
Browser ── axios ──► /api/forecast?city=|lat&lon   ─┐
        ── axios ──► /api/cities?q=                 ┼─► services/owmServer.ts ──► api.openweathermap.org
        ── axios ──► /api/aqi?lat&lon              ─┘         (WEATHER_API_KEY)
```

- `src/services/owmServer.ts` — SERVER-ONLY core (`fetch*` fns + private key access). Imported exclusively by route handlers.
- `src/services/weatherApi.ts` — CLIENT wrappers (`get*`/`find*` fns hitting `/api/*`). Same signatures as before.
- `src/lib/apiHelpers.ts` — shared route helpers: `badRequest`, `toNumber`, `handleOwmError` (maps upstream axios errors onto `{ message }` JSON with upstream status).
- Param validation per route: city ≤100 chars; lat ±90 / lon ±180 numeric ranges.

## Env Migration

`.env.local`: `NEXT_PUBLIC_WEATHER_KEY=<key>` → `WEATHER_API_KEY=<same key>` (old var removed — nothing references it anymore). `.env.example` documents only the private var.

## Gotchas discovered (for future agents)

1. **Don't colocate helper files under `app/api/`** — a plain `helpers.ts` there caused "Cannot find module for page" build failures in Next 15.3. Helpers live in `src/lib/apiHelpers.ts`.
2. **No `*/` inside block comments** — `get*/find*` in a JSDoc terminated the comment early and broke parsing.
3. **Production `next start` does NOT auto-shift ports** (dev does). If 3000 is taken use `npm run start -- -p 3100`.
4. After changing module boundaries, verify the split with a bundle grep — dead server code had initially leaked its host string into the page chunk until the two files were separated.

## Verification (all passed)

- `npm run lint` clean · `npm run build` clean, routes listed as dynamic ƒ
- Live smoke test against real OWM: `/api/forecast?city=Tokyo` (40 entries), `/api/cities?q=Paris`, `/api/aqi` Tokyo → AQI 1, invalid params → HTTP 400
- Client-bundle grep over `.next/static`: secret value ABSENT · OWM host string ABSENT · legacy `NEXT_PUBLIC_WEATHER_KEY` ABSENT

## Out of Scope

- Rate limiting / caching on the proxy (natural follow-up if abused)
- Swapping axios for fetch in route handlers
