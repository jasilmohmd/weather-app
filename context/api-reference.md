# API Reference

Two-hop architecture since `feat/server-key-proxy`:

```
Browser code ──► /api/* route handlers ──► api.openweathermap.org
                    (injects private
                     WEATHER_API_KEY)
```

The browser never sees the OWM key. All OWM traffic goes through our Next.js route handlers.

---

## Client-Facing Routes (`src/app/api/`)

| Route | Params | Returns | Errors |
|---|---|---|---|
| `GET /api/forecast` | `city=<name>` **or** `lat=&lon=` | OWM forecast JSON (`WeatherResponse`) | `{ message }` w/ upstream status |
| `GET /api/cities` | `q=<partial name>` | `{ list: City[] }` | same |
| `GET /api/aqi` | `lat=&lon=` | OWM air-pollution JSON (`AirPollutionResponse`) | same |

- Validation: city ≤100 chars; lat within ±90, lon within ±180; missing/invalid → HTTP 400 `{ message }`.
- Handlers live in `src/app/api/{forecast,cities,aqi}/route.ts`; shared helpers in `src/lib/apiHelpers.ts`.

## Service Layer Mapping

| Client fn (`services/weatherApi.ts`) | Calls | Server core (`services/owmServer.ts`) |
|---|---|---|
| `getForecastByCity(city)` | `/api/forecast?city=` | `fetchForecastByCity` → `/forecast?q=&cnt=56` |
| `getForecastByCoords(lat, lon)` | `/api/forecast?lat&lon` | `fetchForecastByCoords` → `/forecast?lat&lon` |
| `findCities(query)` | `/api/cities?q=` | `fetchCities` → `/find?q=` |
| `getAirPollution(lat, lon)` | `/api/aqi?lat&lon` | `fetchAirPollution` → `/air_pollution?lat&lon` |

Signatures are stable — hooks (`useWeather`, `useAqi`) and components import only the client fns.

## Response Shapes

### Forecast (`WeatherResponse`, full interfaces in `src/types/weather.ts`)

```ts
interface WeatherResponse {
  cod: string; message: number; cnt: number;
  list: WeatherEntry[];      // 3-hourly slots; free tier caps at 40 (5 days)
  city: City;                // coord, country, timezone, sunrise/sunset (unix s)
}
interface WeatherEntry {
  dt: number;                // unix seconds UTC
  main: MainWeather;         // Kelvin temps, hPa pressure
  weather: WeatherDescription[]; // icon like "10d"
  wind: Wind; visibility: number; pop: number; sys: Sys; dt_txt: string;
}
```

Note: despite `cnt=56` being requested, the free tier returns max **40 entries** — UI slices account for this.

### Air pollution (`AirPollutionResponse`)

```ts
{ list: [{ main: { aqi: 1|2|3|4|5 }, components: { co,no,no2,o3,so2,pm2_5,pm10,nh3 }, dt }] }
```
AQI bands: 1 Good · 2 Fair · 3 Moderate · 4 Poor · 5 Very Poor. Coords come free from `forecast.city.coord`.

## Key Handling & Security

1. `WEATHER_API_KEY` (no `NEXT_PUBLIC_` prefix) lives in `.env.local` and is read **only** in `owmServer.ts` via route handlers.
2. Verified absent from client bundle: secret value, `api.openweathermap.org` host string, legacy env name (grep `.next/static` after builds when touching module boundaries).
3. Legacy `NEXT_PUBLIC_WEATHER_KEY` was removed in `feat/server-key-proxy` — if an old `.env.local` still has it, migrate to `WEATHER_API_KEY=`.
4. The old hardcoded-key incident (former S1) is cleaned from source; the value remains in git history — rotate if the repo was ever public.

## Rate Limits & Errors

- Free tier: 60 calls/min, 1M/month. Autocomplete is debounced 300 ms client-side; keep it that way.
- Upstream errors pass through: handler returns upstream status + `{ message }` (e.g. 404 "city not found"), which Navbar's `axios.isAxiosError` narrowing renders.
- Units stay **Kelvin** end-to-end; conversions happen client-side via utils.

## Type Ownership

- Interfaces: `src/types/weather.ts` (incl. `AirPollutionResponse`).
- Server-only OWM access: `src/services/owmServer.ts` — never import from client code.
