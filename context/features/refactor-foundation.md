# Feature Spec: Refactor Foundation (P0 — do first)

## Metadata

| Field | Value |
|---|---|
| Status | planned |
| Priority | **P0** — prerequisite for favorites, dark-mode, AQI specs |
| Depends on | — |
| Resolves | B1 B2 B3 B4 B5 · A1 A2 A3 A5 · S1 · T1 T2 T3 T4 |
| New dependencies | none |

## Summary

Structural cleanup that makes every future feature cheap: extract OWM types into `src/types/`, create a typed API service layer and a `useWeather` hook, split the 455-line `page.tsx` into section components, fix React Query usage, and clear out all quick-fix bugs from `known-issues.md`. **No visual/behavioral changes intended** except bug fixes listed below.

## User Stories

- As a developer/agent, I want types in a dedicated module so components stop importing from a page file.
- As a developer/agent, I want a service layer + queryKey-driven hook so adding endpoints (AQI etc.) is trivial.

## Technical Design

### Target structure

```
src/
├── types/
│   └── weather.ts              ← interfaces moved verbatim from page.tsx:24-91
├── services/
│   └── weatherApi.ts           ← axios instance + 3 endpoint fns
├── hooks/
│   └── useWeather.ts           ← useQuery wrapper keyed by place
├── components/                 (+ new splits)
│   ├── CurrentWeatherHero.tsx  ← page.tsx:165-227 markup
│   ├── HourlyForecast.tsx      ← page.tsx:231-259
│   ├── DailyForecast.tsx       ← page.tsx:263-292
│   └── WeatherSkeleton.tsx     ← page.tsx:320-455 as-is
└── app/page.tsx                ← thin composition only (~80 lines)
```

### Service layer (`src/services/weatherApi.ts`)

```ts
const http = axios.create({ baseURL: "https://api.openweathermap.org/data/2.5" });

export async function getForecastByCity(city: string): Promise<WeatherResponse> {
  const { data } = await http.get<WeatherResponse>("/forecast", {
    params: { q: city, appid: process.env.NEXT_PUBLIC_WEATHER_KEY, cnt: 56 },
  });
  return data;
}
export async function getForecastByCoords(lat: number, lon: number) { … }  // Navbar geolocation flow
export async function findCities(query: string): Promise<City[]> { … }     // Navbar autocomplete
```

### Hook (`src/hooks/useWeather.ts`)

```ts
export function useWeather(place: string) {
  return useQuery({
    queryKey: ["weather", "forecast", place],   // fixes A2 — place IN the key
    queryFn: () => getForecastByCity(place),
    staleTime: 10 * 60 * 1000,                  // weather doesn't need per-focus refetch
  });
}
```
Delete `useEffect(refetch)` at `page.tsx:112-114`; switching city now just changes the key. Keep `loadingCityAtom` for the skeleton UX until A3 delays are removed.

### QueryClient fix (A1)

`layout.tsx:32` → `const [queryClient] = useState(() => new QueryClient());`

## Files to Create

```
src/types/weather.ts
src/services/weatherApi.ts
src/hooks/useWeather.ts
src/components/CurrentWeatherHero.tsx
src/components/HourlyForecast.tsx
src/components/DailyForecast.tsx
src/components/WeatherSkeleton.tsx
.env.example
```

## Files to Modify

| File | Change |
|---|---|
| `src/app/page.tsx` | gut to composition root; delete types (:24-91), inline fetch (:101-110), effect (:112-114), skeleton (:320-455); import from new modules |
| `src/app/layout.tsx` | :32 QueryClient via useState; restore metadata export (:21-24) with real title/description |
| `src/app/globals.css` | add `.scrollbar-hide` + `.pb-safe` helpers; delete both styled-jsx blocks (`page.tsx:299-310`, `:441-452`) |
| `src/components/Navbar.tsx` | :10 import types from `@/types/weather`; use `findCities`/`getForecastByCoords`; apply B3/A3/A4/S1 fixes below |
| `next.config.ts` | normalize to ESM default-export pattern (T7) |

## Bug Fixes Included (from known-issues.md)

| ID | Fix | Where after refactor |
|---|---|---|
| B1 | `sunset={safeFormatUnix(data.city.sunset, …)}` | DailyForecast props (both call sites) |
| B2 | replaced by dark-mode spec's gradient helper; interim: collapse ternary to single class string | page composition |
| B3 | `suggestions.length >= 1` condition; also render error row when list empty | Navbar SuggestionBox (:203) |
| B4 | `Math.round` in both converters | `utils/convertKelvinToCelsius.ts (then named ...Celcius.ts)` |
| B5 | heading "Next 5 Days" + comment matching `.slice(1,6)` behavior | DailyForecast |
| A3 | remove both `setTimeout(...,1000)` blocks; skeleton driven by real loading state | Navbar :79-82, :105-109 |
| A4 | add error callback to `getCurrentPosition`; surface message via existing error state | Navbar :66-92 |
| A5 | styled `<ErrorState>` component replacing raw string return | page composition |
| S1 | delete hardcoded-key comment line; add `.env.example` with `NEXT_PUBLIC_WEATHER_KEY=` placeholder | page.tsx:22, repo root |

## Implementation Steps

Each step leaves the app buildable:

1. [ ] Create `types/weather.ts` (move interfaces verbatim); repoint imports in `Navbar.tsx:10` and page internals.
2. [ ] Create `services/weatherApi.ts`; swap axios call sites in page + Navbar to use it (behavior identical).
3. [ ] Fix layout QueryClient (useState initializer).
4. [ ] Create `hooks/useWeather.ts` with composite queryKey; delete refetch effect; verify city switching still works and cached cities reappear instantly.
5. [ ] Extract WeatherSkeleton → component; hoist scrollbar/pb-safe css into globals.css; delete styled-jsx blocks.
6. [ ] Extract CurrentWeatherHero / HourlyForecast / DailyForecast; keep prop shapes aligned with existing conventions (parents format strings).
7. [ ] Apply bug fixes B1, B3, B4, B5, A3, A4, A5, S1 (see table).
8. [ ] Restore metadata in layout; add `.env.example`.
9. [ ] Full pass: `npm run lint && npm run build`; manual smoke test all flows (search, suggestion click, submit, geolocation, unit toggle, hourly scroll).

## Acceptance Criteria

- [ ] `page.tsx` ≤ ~100 lines, contains zero type/interface/fetch definitions.
- [ ] No file imports types from `@/app/page` anymore (`grep -r "from '@/app/page'" src` → empty).
- [ ] Switching Delhi → London → Delhi shows Delhi instantly from cache (queryKey working).
- [ ] Sunset ≠ sunrise values displayed (B1 fixed).
- [ ] Exact-match single suggestion is clickable (B3 fixed).
- [ ] °C and °F rounding consistent (B4 fixed).
- [ ] No artificial delays; skeleton shows during real fetches only (A3 fixed).
- [ ] Denied geolocation permission shows visible message (A4 fixed).
- [ ] App has `<title>` and meta description again (T4 fixed).

## Verification Checklist

```bash
npm run lint && npm run build
grep -rn "setTimeout" src          # expect: no matches
grep -rn "appid=7caaebc" src       # expect: no matches (S1)
```

## Out of Scope

- Test suite introduction (backlog item)
- Route-handler key proxy (S2 backlog)
- Any visual redesign beyond bug-level corrections
