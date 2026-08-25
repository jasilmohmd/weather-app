# API Reference — OpenWeatherMap

All requests are made **client-side** with Axios. Base URL: `https://api.openweathermap.org`.

Auth: `appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}` appended to every URL.

---

## Endpoints Currently Used

### 1. Forecast by city name (main data source)

```
GET /data/2.5/forecast?q={city}&appid={KEY}&cnt=56
```
- Called in: `src/app/page.tsx:105` (queryFn of the only useQuery)
- `cnt=56` = 7 days × 8 three-hourly slots (API returns 5-day/3-hour by default; cnt caps it)
- Response typed as `WeatherResponse` (interfaces live in `page.tsx:24-91`)

```ts
interface WeatherResponse {
  cod: string; message: number; cnt: number;
  list: WeatherEntry[];      // timestamped forecast slots
  city: City;                // includes coord, country, timezone, sunrise, sunset (unix seconds)
}
interface WeatherEntry {
  dt: number;                // unix seconds (UTC)
  main: MainWeather;         // temp/feels_like/temp_min/max/pressure/humidity…  (Kelvin, hPa)
  weather: WeatherDescription[]; // { id, main, description, icon } — icon like "10d"
  clouds: Clouds; wind: Wind;
  visibility: number;        // meters
  pop: number;               // precipitation probability 0..1
  sys: Sys;                  // pod: "d"|"n"
  dt_txt: string;            // "YYYY-MM-DD HH:mm:ss" UTC
}
```

### 2. City autocomplete

```
GET /data/2.5/find?q={partialName}&appid={KEY}
```
- Called in: `src/components/Navbar.tsx:35` from `handleInputChange()` when input length > 3
- Only `response.data.list[].name` is used (mapped through the shared `City` type imported from `@/app/page`)
- Debouncing: none — fires per keystroke past 3 chars

### 3. Forecast by coordinates (geolocation flow)

```
GET /data/2.5/forecast?lat={lat}&lon={lon}&appid={KEY}
```
- Called in: `src/components/Navbar.tsx:76` after `navigator.geolocation.getCurrentPosition`
- Only `response.data.city.name` is used → written to `placeAtom` → triggers refetch by name

## Key Handling & Security Notes

1. `NEXT_PUBLIC_WEATHER_KEY` lives in `.env.local` (spaces around `=`, single-quoted). Because of the `NEXT_PUBLIC_` prefix it is **inlined into the client bundle** — anyone can extract it.
2. ⚠️ The key is additionally hardcoded in a comment at `src/app/page.tsx:22`:
   ```
   // https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=<LIVE_KEY_EXPOSED>&cnt=2
   ```
   Remove this line during refactor (tracked as known-issue S1). The key is already in git history — rotate it in the OWM dashboard regardless.
3. There are **no Next.js route handlers / API routes**. A future hardening step would proxy OWM through a route handler using a private (non-public) env var so the key never reaches the browser.
4. No `.env.example` exists yet — add one documenting `NEXT_PUBLIC_WEATHER_KEY=` (refactor spec step R8).

## Rate Limits & Errors

- Free tier: 60 calls/min, 1M calls/month. Autocomplete-per-keystroke is the main burn risk → add debouncing when touching search.
- Error shape (axios): `{ cod, message }` e.g. `cod: "404", message: "city not found"`.
- Units: all temperatures arrive in **Kelvin**; conversions happen client-side via `src/utils/convertKelvinToCelcius.ts`. You can alternatively request `&units=metric|imperial`, but the app's unit toggle expects Kelvin source data — keep Kelvin.

## Planned Endpoints (not yet integrated)

| Endpoint | Purpose | Spec |
|---|---|---|
| `GET /data/2.5/air_pollution?lat=&lon=&appid=` | AQI (1–5 scale) + pollutant concentrations | [`features/aqi-weather-maps.md`](./features/aqi-weather-maps.md) |

Coords for AQI come free from the existing forecast response: `WeatherResponse.city.coord { lat, lon }`.

## Type Ownership (current vs target)

- **Now:** OWM interfaces are exported from `src/app/page.tsx` and imported elsewhere (e.g. `Navbar.tsx:10` does `import { City, WeatherEntry } from '@/app/page'`). Importing types from a page file is fragile — pages get recompiled/restructured often.
- **Target (after refactor spec):** `src/types/weather.ts` owns them; page/components/services import from there.
