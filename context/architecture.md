# Architecture

## Big Picture

This is a **client-side SPA-style app** running inside Next.js App Router. There is exactly one route (`/`). Both `layout.tsx` and `page.tsx` are marked `'use client'`, so no server components/RSC benefits are used. All API calls happen from the browser with Axios.

## Data Flow

```
User types in Searchbox (Navbar)
        │  onChange → handleInputChange() — axios GET /data/2.5/find (autocomplete)
        │  onSubmit / suggestion click
        ▼
placeAtom updated ──────────────► loadingCityAtom toggles skeleton
        │
        ▼
page.tsx useEffect([place]) calls refetch()          ⚠️ anti-pattern
        │
        ▼
useQuery<WeatherResponse> queryKey ['repoData']       ⚠️ place NOT in key
        │  queryFn: axios GET /data/2.5/forecast?q={place}&cnt=56
        ▼
Derived data (computed inline in page.tsx):
  • firstdata            = list[0]                    (current conditions)
  • uniqueDates          = deduped YYYY-MM-DD strings (:120-126)
  • firstDataForEachDate = first entry ≥6am per day   (:129-135)
        │  props down (pre-formatted strings)
        ▼
<Navbar> <WeatherDetails> <ForecastWeatherDetails> <WeatherIcon> <Footer>
```

⚠️ Known anti-patterns in this flow are documented in [`known-issues.md`](./known-issues.md) (#3, #4) and fixed by the refactor spec.

## State Management

### Jotai global atoms — `src/app/atom.ts` (entire file)

| Atom | Type | Default | Writers | Readers |
|---|---|---|---|---|
| `placeAtom` | `string` | `"Delhi"` | `Navbar` (`setPlace`) | `page.tsx` |
| `loadingCityAtom` | `boolean` | `false` | `Navbar` (`setLoadingCity`) | `page.tsx` |
| `isCelsiusAtom` | `boolean` | `true` | `Navbar` (`setIsCelsius`) | `page.tsx`, `ForecastWeatherDetails` via props |

Nothing is persisted to localStorage yet. New persistent state should use jotai's `atomWithStorage` (see favorites/dark-mode specs).

### TanStack Query

Single `useQuery<WeatherResponse>` at `src/app/page.tsx:101-110`. QueryKey is the static string `'repoData'`. A `useEffect` at `:112-114` refetches on `place` change. Loading states consumed: `isPending` → "Loading..." bounce; `loadingCityAtom` → `<WeatherSkeleton />`.

### Local component state

Only `Navbar.tsx`: `city` (input value), `error` (string), `suggestions: string[]`, `showSuggestions` (bool).

## Component Tree & Prop Contracts

```
RootLayout (layout.tsx, 'use client')
├── QueryClientProvider                       # ⚠️ new QueryClient() per render (:32)
└── Home (page.tsx)
    ├── Navbar { location?: string; data?: WeatherEntry }
    │   ├── MapPin button → handleCurrentLocation()  (geolocation → coords forecast → city name)
    │   ├── location + formatted date display
    │   ├── °C/°F toggle button
    │   ├── Searchbox { className?; value; onChange; onSubmit }   [desktop md:flex]
    │   ├── SuggestionBox (internal, :190) { showSuggestions; suggestions; handleSuggestionClick; error }
    │   └── second Searchbox + SuggestionBox clone [mobile]
    ├── main
    │   ├── WeatherSkeleton (internal fn, :320-455)   when loadingCityAtom=true
    │   ├── Current hero section
    │   │   ├── WeatherIcon { iconname: IconKey|string; …HTMLProps<HTMLDivElement> }
    │   │   └── big temp / description / feels-like / H-L
    │   ├── WeatherDetails { visibility; humidity; windSpeed; airPressure; sunrise; sunset }  ← all pre-formatted strings
    │   │   └── internal SingleWeatherDetail { icon: React.ElementType; label; value; unit? }
    │   ├── Hourly strip (inline in page.tsx :231-259) — first 12 slots of data.list
    │   ├── Daily section "5-Day Forecast" (:262-292) — firstDataForEachDate.slice(1,6)
    │   │   └── ForecastWeatherDetails extends WeatherDetailProps {
    │   │         weatherIcon; date; day; temp; feels_like; temp_min; temp_max; description; isCelsius }
    │   │       └── named export CompactWeatherDetails (4-tile row)
    │   └── styled-jsx block (.scrollbar-hide, .pb-safe)  ⚠️ duplicated in both view fns
    └── Footer
```

**Key convention:** parents convert units/format values, children receive ready-to-render **strings** (except `ForecastWeatherDetails` which gets raw Kelvin numbers + `isCelsius` flag).

## Styling System

- **Tailwind v4 utility classes inline everywhere.** No component CSS files except two styled-jsx blocks.
- Signature glass card recipe (also baked into `Container.tsx`): `bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl`
- Page background: orange gradient `bg-gradient-to-br from-amber-300 via-orange-400 to-red-400` + two animated blurred white orbs (`animate-pulse blur-3xl bg-white/5`)
- Text hierarchy: white with opacity steps — `text-white`, `/90`, `/80`, `/70`, `/60`, `/50`, `/40`, `/30`; weights `font-light`/`font-extralight`
- Fonts: Geist Sans/Mono via `next/font/google` CSS variables in layout
- Helper classes `.scrollbar-hide` and `.pb-safe` defined twice via styled-jsx (`page.tsx:299-310` and `:441-452`)
- `cn()` (clsx + tailwind-merge) exists but is used only by `Searchbox.tsx`

## Error Handling Model

| Layer | Pattern |
|---|---|
| Autocomplete (Navbar `:43-53`) | try/catch → `axios.isAxiosError(error)` narrowing → show `error.response.data?.message` in SuggestionBox |
| Geolocation (Navbar `:84-87`) | bare `console.log(error)` — user never sees failure |
| Main query (page `:144`) | raw string return `'An error has occurred: ' + error.message` — no styled error UI, no error boundary |
| Dates | `safeFormat`/`safeFormatUnix` return `"N/A"` or `"Invalid date"` instead of throwing |

## Deliberate Quirks (do not "fix" casually)

1. **Artificial delays:** `setTimeout(...,1000)` wraps city-switching in `Navbar.tsx:79-82` and `:105-109` to let the skeleton show. Removing them changes UX feel; removing them properly = put `place` in queryKey and rely on React Query loading states.
2. **Day-pick rule:** daily forecast takes the *first entry with hour ≥6am* per date (`page.tsx:129-135`) — this is why the current day may not be today's first slot.
3. **cnt=56** on the forecast call ≈ 7 days × 8 three-hour slots; the UI then slices to hourly-12 and days 1–6.
