# Feature Spec: Air Quality Index + Weather Charts + Radar Map

## Metadata

| Field | Value |
|---|---|
| Status | planned |
| Priority | P2 |
| Depends on | [refactor-foundation.md](./refactor-foundation.md) **required** (service layer + types + hook patterns) |
| Resolves | — |
| New dependencies | `recharts@^2` (charts). Radar uses RainViewer public tiles (no key) OR Windy embed iframe (no key) — decide in step 1 |

## Summary

Three related upgrades bundled because they share the same data plumbing:

1. **AQI tile** — OpenWeatherMap Air Pollution API using coords already present in the forecast response (`city.coord`).
2. **Charts** — temperature line chart + precipitation-probability bars across the forecast window, replacing/augmenting the flat hourly strip.
3. **Radar map** — embedded precipitation radar layer for the active location.

## User Stories

- As a user with respiratory concerns, I want the current AQI at a glance with a color-coded badge.
- As a planner, I want a visual temperature/precipitation trend instead of reading numbers.
- As a weather enthusiast, I want an animated rain radar centered on my city.

## Technical Design

### 1. AQI

Endpoint (add to `services/weatherApi.ts`):
```
GET https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={KEY}
```
Response essentials:
```ts
interface AirPollutionResponse {
  list: Array<{
    main: { aqi: 1 | 2 | 3 | 4 | 5 };        // 1 Good … 5 Very Poor
    components: { co, no2, o3, so2, pm2_5, pm10, nh3 };  // μg/m³
    dt: number;
  }>;
}
```

- New atom-free approach: second `useQuery` inside a `useAqi(lat?, lon?)` hook, `enabled: !!coords`, same `staleTime` as weather. Coords source: `data.city.coord { lat, lon }` from the existing forecast response.
- UI: extend the details grid — new tile or dedicated `AqiBadge` in hero showing label+color:
  `1 Good #00e400 · 2 Fair #ffff00 · 3 Moderate #ff7e00 · 4 Poor #ff0000 · 5 Very Poor #8f3f97`
- Show dominant pollutant (`pm2_5` if > WHO-ish threshold else max component) as sub-text.
- Loading: skeleton pulse like sibling tiles; Error: hide tile silently (non-critical data).

### 2. Charts (`recharts`)

New `src/components/ForecastCharts.tsx` placed between Hourly strip and Daily section:

- **Temperature line:** x = time labels (`safeFormat(dt_txt, "EEE h a")`), y = °C/°F converted series over `data.list` (respect `isCelsiusAtom`); area fill variant acceptable.
- **Precipitation bars:** `pop × 100`% per slot; dual-axis optional — start simple: two stacked charts in one responsive `Container`.
- Style: transparent background, `stroke="white"` variants matching glass theme (revisit when dark-mode spec lands — use CSS vars there).
- ResponsiveContainer height ~200px; horizontal scroll NOT needed (recharts handles width).

### 3. Radar map

Chosen approach: **RainViewer leaflet-free embed is not official; simplest reliable option = Windy embed iframe** pointing at current coords:

```html
<iframe src="https://embed.windy.com/embed2.html?lat={lat}&lon={lon}&zoom=7&overlay=radar&detailLat={lat}&detailLon={lon}" … />
```

- New `src/components/RadarMap.tsx` in a `Container`, lazy-loaded (`next/dynamic`, ssr:false), collapsible section ("Radar ▾") to keep initial load light.
- Fallback alternative if iframe blocked: RainViewer tiles + react-leaflet (adds deps — avoid unless requested).

## Files to Create

```
src/components/AqiTile.tsx        // or integrate into WeatherDetails grid
src/components/ForecastCharts.tsx
src/components/RadarMap.tsx
src/hooks/useAqi.ts
```

## Files to Modify

| File | Area | Change |
|---|---|---|
| `src/types/weather.ts` | append | `AirPollutionResponse` interface |
| `src/services/weatherApi.ts` | append | `getAirPollution(lat, lon)` |
| `src/app/page.tsx` | composition | mount AqiTile/charts/RadarMap; pass coords down |
| `package.json` | deps | add recharts |

## Implementation Steps

1. [ ] Decide radar approach (Windy embed recommended first); note decision here.
2. [ ] Add type + service fn for air_pollution; test URL directly in browser with known lat/lon.
3. [ ] Build `useAqi` hook; render AQI tile/badge with 5-state colors; wire into grid.
4. [ ] Install recharts; build ForecastCharts with real `list` data; verify °F toggle updates series.
5. [ ] Build RadarMap (dynamic import, collapsed by default); center on active coords; verify city switch recenters.
6. [ ] Loading/error/empty states per component (AQI hidden on error; charts show empty-note; radar shows fallback link).
7. [ ] Mobile pass: charts full-width; radar aspect-ratio box; tiles wrap.

## Acceptance Criteria

- [ ] AQI appears within ~1s of forecast load; matches expected band for a known city; updates on city switch.
- [ ] Charts render 40+ points without layout shift; °C↔°F flips y-axis labels/values.
- [ ] Precipitation bars correlate with `pop` values shown elsewhere.
- [ ] Radar loads lazily (no network request until expanded); recenters on geolocation flow too.
- [ ] AQI failure never blocks weather UI.
- [ ] Lint/build clean; no console warnings from recharts keys.

## Verification Checklist

```bash
npm run lint && npm run build && npm run dev
```
Manual: Delhi (often poor AQI) vs a clean city; switch units mid-chart; open radar, switch city, confirm recenter; throttle network → confirm graceful degradation.

## Out of Scope

- Historical AQI trends / forecasts endpoint (`air_pollution/history|forecast`)
- Pollutant detail modal (raw components table)
- Custom map controls/geolocation marker layers
- Server-side caching of OWM responses
