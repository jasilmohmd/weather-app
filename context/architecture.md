# Architecture

## Big Picture

This is a **client-side SPA-style app** running inside Next.js App Router. There is exactly one route (`/`). Both `layout.tsx` and `page.tsx` are marked `'use client'`, so no server components/RSC benefits are used. All API calls happen from the browser with Axios.

## Data Flow

```
User types in Searchbox (Navbar)
        │  onChange → debounced handleInputChange() → findCities() ─┐
        │  onSubmit / suggestion click                              │
        ▼                                                           │
placeAtom updated                                                   │
        │                                                           ▼
useWeather(place) hook — queryKey ["weather","forecast", place]   GET /api/cities
        │  queryFn: getForecastByCity(place)  ← services/weatherApi.ts
        │           └─► /api/forecast route ─► owmServer.ts (private key) ─► OWM
        ▼
page.tsx derives nothing — passes data down:
  • CurrentWeatherHero  gets list[0] + city (+ AqiTile uses city.coord)
  • HourlyForecast      gets full list (slices 12 internally)
  • ForecastCharts      gets full list (recharts)
  • DailyForecast       gets full list + city (dedupes dates, ≥6am rule internally)
  • RadarMap            gets city.coord (lazy iframe on expand)
        ▼
<Navbar> <PlacesBar> <WeatherDetails> <ForecastWeatherDetails> <WeatherIcon> <Footer>

Loading: isPending → <WeatherSkeleton/> · Error: styled Container card
API key never leaves the server — browser talks only to /api/*.
```

## State Management

### Jotai global atoms — `src/app/atom.ts`

| Atom | Type | Default | Writers | Readers |
|---|---|---|---|---|
| `placeAtom` | `string` | `"Delhi"` | `Navbar` (`selectPlace`) | `page.tsx` |
| `isCelsiusAtom` 💾 | `boolean` | `true` | Navbar toggle | page → props |
| `savedPlacesAtom` 💾 | `string[]` | `[]` | Navbar pin toggle, PlacesBar remove | Navbar, PlacesBar |
| `recentSearchesAtom` 💾 | `string[]` | `[]` | Navbar (`selectPlace`), PlacesBar remove | PlacesBar |
| `themeAtom` 💾 | `"light"\|"dark"\|"system"` | `"system"` | Navbar cycle button | ThemeSync, layout init script |

💾 = persisted to localStorage via `atomWithStorage` (keys `weather.isCelsius`, `weather.savedPlaces`, `weather.recentSearches`, `weather.theme`; caps 10/5 for places in `utils/recentSearches.ts`). `isCelsius` persistence is planned for the dark-mode spec.

### TanStack Query

Single query via `useWeather(place)` hook (`src/hooks/useWeather.ts`): `queryKey: ["weather", "forecast", place]`, `staleTime: 10 min`. Switching cities changes the key (no manual refetch); revisiting a city renders instantly from cache.

### Local component state

Only `Navbar.tsx`: `city` (input value), `error` (string), `suggestions: string[]`, `showSuggestions` (bool).

## Component Tree & Prop Contracts

```
RootLayout (layout.tsx — SERVER component, exports metadata)
└── Providers (providers.tsx, 'use client')
    └── QueryClientProvider                  # useState-created client
        └── Home (page.tsx, 'use client')
            ├── [isPending]  → WeatherSkeleton
            ├── [error]      → styled Container error card
            ├── Navbar { location: string; data: WeatherEntry }
            │   ├── MapPin button → getForecastByCoords → setPlace(city name)
            │   ├── location + formatted date display
            │   ├── °C/°F toggle button
            │   ├── Searchbox { className?; value; onChange; onSubmit }   [desktop md:flex]
            │   ├── SuggestionBox (internal) { showSuggestions; suggestions; handleSuggestionClick; error }
            │   └── second Searchbox + SuggestionBox clone [mobile]
            ├── PlacesBar (after Navbar) — saved ★ + recent chips, click = switch, × = remove
            ├── main
            │   ├── CurrentWeatherHero { data: WeatherEntry; city: City; isCelsius }
            │   │   ├── hero card (WeatherIcon, big temp, description, feels-like, H/L)
            │   │   ├── AqiTile { lat; lon } — self-contained useAqi, hides on error
            │   │   └── WeatherDetails { visibility; humidity; windSpeed; airPressure; sunrise; sunset }  ← pre-formatted strings
            │   │       └── internal SingleWeatherDetail { icon: React.ElementType; label; value; unit? }
            │   ├── HourlyForecast { list: WeatherEntry[]; isCelsius }    — slices first 12 internally
            │   ├── ForecastCharts { list; isCelsius }                    — recharts temp line + precip bars
            │   ├── DailyForecast { list; city; isCelsius }               — date-dedupe + ≥6am rule + slice(1,6) internally
            │   ├── RadarMap { lat; lon }                                 — collapsed; iframe mounts only when opened
            │   │   └── ForecastWeatherDetails extends WeatherDetailProps {
            │   │         weatherIcon; date; day; temp; feels_like; temp_min; temp_max; description; isCelsius }
            │   │       └── named export CompactWeatherDetails (4-tile row)
            │   └── bottom safe-area spacer
            └── Footer
```

**Key convention:** parents convert units/format values, children receive ready-to-render **strings** (except `ForecastWeatherDetails` which gets raw Kelvin numbers + `isCelsius` flag).

## Styling System

- **Tailwind v4 utility classes inline everywhere.** No component CSS files; shared helpers (`.scrollbar-hide`, `.pb-safe`) live in `globals.css`.
- **Dark mode is class-based:** `@custom-variant dark` in globals.css + `.dark` on `<html>` (applied pre-paint by inline script in layout, kept in sync by `ThemeSync.tsx`). Use `dark:` variants freely.
- Page background gradient is condition-aware via `getWeatherGradient()` (`utils/getWeatherGradient.ts`). ⚠️ All classes there are literal strings — Tailwind can't see dynamically-built class names; add new conditions as full literals.
- Signature glass card recipe (also baked into `Container.tsx`): `bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl`
- Page background: condition-aware gradient (see `getWeatherGradient`) + two animated blurred white orbs (`animate-pulse blur-3xl bg-white/5`)
- Text hierarchy: white with opacity steps — `text-white`, `/90`, `/80`, `/70`, `/60`, `/50`, `/40`, `/30`; weights `font-light`/`font-extralight`
- Fonts: Geist Sans/Mono via `next/font/google` CSS variables in layout
- Helper classes `.scrollbar-hide` and `.pb-safe` defined twice via styled-jsx (`page.tsx:299-310` and `:441-452`)
- `cn()` (clsx + tailwind-merge) exists but is used only by `Searchbox.tsx`

## Error Handling Model

| Layer | Pattern |
|---|---|
| Autocomplete (Navbar) | debounced; try/catch → `axios.isAxiosError(error)` narrowing → show `error.response.data?.message` in SuggestionBox |
| Geolocation (Navbar) | error callback on `getCurrentPosition` + try/catch around coords fetch → surfaced via same `error` state |
| Main query (page.tsx) | styled `Container` error card with message + retry hint |
| `/api` routes | validate params → 400; upstream OWM errors mapped by `lib/apiHelpers.handleOwmError` to `{ message }` + status |
| Dates | `safeFormat`/`safeFormatUnix` return `"N/A"` or `"Invalid date"` instead of throwing |

## Deliberate Quirks (do not "fix" casually)

1. **Day-pick rule:** daily forecast takes the *first entry with hour ≥6am* per date (`DailyForecast.tsx`) — this is why the current day may not be today's first slot.
2. **cnt=56** on the forecast call ≈ 7 days × 8 three-hour slots; HourlyForecast slices to 12, DailyForecast slices days 1–6.
3. **Skeleton replaces whole page while pending** — first load and every uncached city switch show `<WeatherSkeleton/>`; cached cities render instantly thanks to the composite queryKey.
