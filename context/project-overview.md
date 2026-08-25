# Project Overview

## Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.3.3 | Client-heavy; both entry files use `'use client'` |
| UI | React | ^19.0.0 | |
| Language | TypeScript | ^5 | `strict: true`; target ES2017; bundler resolution |
| Styling | Tailwind CSS | ^4 | CSS-first config (`@import "tailwindcss"` only); NO tailwind.config file |
| Client state | Jotai | ^2.12.5 | 3 global atoms in `src/app/atom.ts` |
| Server state | TanStack React Query | ^5.80.7 | Single query in `page.tsx` |
| HTTP | Axios | ^1.10.0 | Direct calls from client components; no service layer yet |
| Dates | date-fns | ^2.30.0 | Wrapped defensively by `safeFormat`/`safeFormatUnix` |
| Icons | lucide-react ^0.523.0 + react-icons ^5.5.0 | | Two libraries mixed (lucide primary); weather icons are emoji |
| Class utils | clsx ^2.1.1 + tailwind-merge ^3.3.1 | | Via `cn()` helper (`src/utils/cn.ts`) |

Build tooling is Next.js's built-in compiler + PostCSS (`postcss.config.mjs` → `@tailwindcss/postcss`). No test framework installed.

## Scripts (`package.json`)

```bash
npm run dev           # next dev
npm run build         # next build
npm run start         # next start
npm run lint          # next lint
npm test              # vitest run (39 tests)
npm run test:watch    # vitest watch mode
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

Tests live in colocated `__tests__/` folders (`src/utils/__tests__/`, `src/components/__tests__/`) plus shared setup at `src/test/setup.ts`; config in `vitest.config.mts` (jsdom, `@/*` alias). Note: a running `next dev` locks `.next` and blocks `next build` — stop one before the other on Windows.

## Environment Variables

| Var | Where | Notes |
|---|---|---|
| `WEATHER_API_KEY` | `.env.local` | OpenWeatherMap key, **private** (no `NEXT_PUBLIC_` prefix) — read only by `/api` route handlers via `services/owmServer.ts`; never shipped to the browser. `.env*` is gitignored **except `.env.example`**. Migrated from the old client-exposed `NEXT_PUBLIC_WEATHER_KEY`. |

## Full File Map

```
weather-app/
├── .env.local                    # OWM API key (gitignored)
├── .env.example                  # tracked template (gitignore-negated)
├── eslint.config.mjs             # FlatCompat → next/core-web-vitals + next/typescript
├── next.config.ts                # standard ESM NextConfig export (no custom settings)
├── postcss.config.mjs            # @tailwindcss/postcss
├── tsconfig.json                 # strict, alias @/* → ./src/*
├── package.json                  # see scripts above
├── public/                       # icon.svg (PWA), offline.html shell, sw.js (versioned caches)
└── src/
    ├── app/
    │   ├── api/                   # route handlers (only OWM entry point; key stays server-side)
    │   │   ├── aqi/route.ts       # GET ?lat&lon → air pollution JSON
    │   │   ├── cities/route.ts    # GET ?q → { list: City[] }
    │   │   └── forecast/route.ts  # GET ?city= or ?lat&lon → WeatherResponse
    │   ├── error.tsx             # client error boundary (retry + digest, glass-styled)
    │   ├── not-found.tsx         # 404 page with link home
    │   ├── manifest.ts           # PWA webmanifest route (/manifest.webmanifest)
    │   ├── globals.css           # tailwind import + dark custom-variant + .scrollbar-hide / .pb-safe    │   ├── layout.tsx            # SERVER component: Geist fonts + metadata + <Providers>
    │   ├── providers.tsx         # 'use client': QueryClientProvider (useState-created client)
    │   ├── page.tsx              # thin composition root (~80 lines): useWeather → sections
    │   ├── atom.ts               # placeAtom, isCelsiusAtom💾, savedPlacesAtom💾, recentSearchesAtom💾, themeAtom💾
    │   │                         #    (💾 = persisted via jotai atomWithStorage → localStorage)
    │   └── favicon.ico
    ├── components/               # all default-exported PascalCase .tsx
    │   ├── AqiTile.tsx           # AQI 1–5 badge + dominant pollutant (hides on error)
    │   ├── Container.tsx         # glass-card wrapper (bg-white/10 backdrop-blur-3xl …)
    │   ├── CurrentWeatherHero.tsx      # hero card + AQI tile + 6-tile WeatherDetails grid
    │   ├── DailyForecast.tsx           # date-dedupe + first-entry-≥6am logic + "Next 5 Days"
    │   ├── ForecastCharts.tsx          # recharts: temperature line + precipitation bars
    │   │                             #   (loaded via next/dynamic in page.tsx — keeps ~100 kB out of initial load)
    │   ├── Footer.tsx            # static credits card
    │   ├── ForecastWeatherDetails.tsx  # one row of daily forecast + compact details grid
    │   ├── HourlyForecast.tsx          # first 24 slots, scroll-snap, weekday markers on day change
    │   ├── LocaleSync.tsx              # mirrors localeAtom to <html lang/dir> (rtl for Arabic)
    │   ├── Navbar.tsx            # location/date, geolocation btn, unit toggle, pin-city star,
    │   │                         #    desktop+mobile Searchbox, internal SuggestionBox
    │   ├── PlacesBar.tsx         # saved + recent city chips (localStorage-persisted)
    │   ├── PwaRegister.tsx       # registers /sw.js in production builds only
    │   ├── RadarMap.tsx          # collapsible Windy radar iframe (loads only when opened)
    │   ├── Searchbox.tsx         # controlled form input + submit icon (uses cn())
    │   ├── ThemeSync.tsx         # keeps .dark class on <html> in sync with themeAtom + OS
    │   ├── WeatherDetails.tsx    # 6 detail tiles; also named-export CompactWeatherDetails
    │   ├── WeatherIcon.tsx       # OWM icon-code → emoji map, ☀️ fallback
    │   └── WeatherSkeleton.tsx   # full-page loading skeleton
    ├── hooks/
    │   ├── useAqi.ts             # useQuery(["weather","aqi",lat,lon]) — enabled only with coords
    │   ├── useI18n.ts            # { t, locale, toggleLocale, dateLocale, dir } from localeAtom
    │   └── useWeather.ts         # useQuery(["weather","forecast",place]) wrapper
    ├── i18n/
    │   ├── config.ts             # Locale type, localeAtom (persisted), switch labels
    │   └── dictionaries.ts       # en source-of-truth + ar; Dict type inferred from en
    ├── lib/
    │   └── apiHelpers.ts         # shared route-handler helpers (badRequest/toNumber/handleOwmError)
    ├── services/
    │   ├── owmServer.ts          # SERVER-ONLY OWM core (fetch* fns + private key)
    │   └── weatherApi.ts         # CLIENT wrappers hitting /api/* (stable signatures)
    ├── types/
    │   └── weather.ts            # all OWM response interfaces incl. AirPollutionResponse
    └── utils/                    # camelCase plain-function modules (filename == primary export)
        ├── cn.ts                 # clsx + tailwind-merge
        ├── convertKelvinToCelsius.ts  # convertKtoC / convertKtoF (both Math.round)
        ├── convertSpeed.ts       # m/s → km/h string
        ├── getDayOrNightIcon.tsx # swaps trailing d/n based on 06–18h window
        ├── getWeatherGradient.ts # OWM condition → gradient stops (literal light+dark: classes)
        ├── metersToKilometers.ts # m → km string (toFixed(0))
        ├── recentSearches.ts     # pushRecent/removePlace + MAX_RECENT_SEARCHES/MAX_SAVED_PLACES
        └── safeFormat.ts         # safeFormat(dateStr, fmt) / safeFormatUnix(unix, fmt) → "N/A"
```
**Folder note:** `types/`, `services/`, `hooks/`, `lib/` exist (created by the refactor + key-proxy specs).

## Config Details

### `tsconfig.json`
- `strict: true`, `noEmit`, moduleResolution `bundler`
- Path alias: `"@/*": ["./src/*"]` — always prefer alias imports over relative paths for cross-folder imports

### `eslint.config.mjs`
- Flat config via `FlatCompat`, extends `next/core-web-vitals` + `next/typescript`
- No custom rules. Run with `npm run lint`.

### `next.config.ts`
- Uses CommonJS `module.exports` inside a `.ts` file (works via interop, inconsistent with ESM configs elsewhere)
- Only setting: `images.remotePatterns` whitelisting `https://openweathermap.org/**` — prepared for OWM icon images that are NOT used yet (app uses emojis instead)

### `globals.css`
- `@import "tailwindcss"` + `@custom-variant dark (&:where(.dark, .dark *))` — dark mode is CLASS-based (`<html class="dark">`), not media-based. Theme tokens would also live here if introduced later.
- Helper classes `.scrollbar-hide`, `.pb-safe`.

## Git Context

~8 commits, tutorial-following history ("type error fix", "z index fix for search city suggestions", "date and time format fix"). Latest at review: `0f97960`.
