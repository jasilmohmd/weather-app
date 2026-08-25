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
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # next lint
```

No `test` script exists.

## Environment Variables

| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_WEATHER_KEY` | `.env.local` | OpenWeatherMap key. `NEXT_PUBLIC_` prefix = shipped to browser by design. `.env*` is gitignored **except `.env.example`** (`!.env.example` negation). Copy it: `cp .env.example .env.local`. |

## Full File Map

```
weather-app/
├── .env.local                    # OWM API key (gitignored)
├── .env.example                  # tracked template (gitignore-negated)
├── eslint.config.mjs             # FlatCompat → next/core-web-vitals + next/typescript
├── next.config.ts                # images.remotePatterns: openweathermap.org/** (currently unused)
├── postcss.config.mjs            # @tailwindcss/postcss
├── tsconfig.json                 # strict, alias @/* → ./src/*
├── package.json                  # see scripts above
├── public/                       # stock create-next-app SVGs only
└── src/
    ├── app/
    │   ├── globals.css           # tailwind import + .scrollbar-hide / .pb-safe helpers
    │   ├── layout.tsx            # SERVER component: Geist fonts + metadata + <Providers>
    │   ├── providers.tsx         # 'use client': QueryClientProvider (useState-created client)
    │   ├── page.tsx              # thin composition root (~80 lines): useWeather → sections
    │   ├── atom.ts               # placeAtom, isCelsiusAtom💾, savedPlacesAtom💾, recentSearchesAtom💾, themeAtom💾
    │   │                         #    (💾 = persisted via jotai atomWithStorage → localStorage)
    │   └── favicon.ico
    ├── components/               # all default-exported PascalCase .tsx
    │   ├── Container.tsx         # glass-card wrapper (bg-white/10 backdrop-blur-3xl …)
    │   ├── CurrentWeatherHero.tsx      # hero card + 6-tile WeatherDetails grid
    │   ├── DailyForecast.tsx           # date-dedupe + first-entry-≥6am logic + "Next 5 Days"
    │   ├── Footer.tsx            # static credits card
    │   ├── ForecastWeatherDetails.tsx  # one row of daily forecast + compact details grid
    │   ├── HourlyForecast.tsx          # first 12 slots, horizontal scroll
    │   ├── Navbar.tsx            # location/date, geolocation btn, unit toggle, pin-city star,
    │   │                         #    desktop+mobile Searchbox, internal SuggestionBox
    │   ├── PlacesBar.tsx         # saved + recent city chips (localStorage-persisted)
    │   ├── Searchbox.tsx         # controlled form input + submit icon (uses cn())
    │   ├── ThemeSync.tsx         # keeps .dark class on <html> in sync with themeAtom + OS
    │   ├── WeatherDetails.tsx    # 6 detail tiles; also named-export CompactWeatherDetails
    │   ├── WeatherIcon.tsx       # OWM icon-code → emoji map, ☀️ fallback
    │   └── WeatherSkeleton.tsx   # full-page loading skeleton
    ├── hooks/
    │   └── useWeather.ts         # useQuery(["weather","forecast",place]) wrapper
    ├── services/
    │   └── weatherApi.ts         # axios instance + getForecastByCity/getForecastByCoords/findCities
    ├── types/
    │   └── weather.ts            # all OWM response interfaces (single source)
    └── utils/                    # camelCase plain-function modules
        ├── cn.ts                 # clsx + tailwind-merge
        ├── convertKelvinToCelcius.ts  # convertKtoC / convertKtoF (both Math.round now)
        ├── getDayOrNightIcon.tsx # swaps trailing d/n based on 06–18h window
        ├── getWeatherGradient.ts # OWM condition → gradient stops (literal light+dark: classes)
        ├── metersToKilometers.ts # m → km string (toFixed(0))
        ├── recentSearches.ts     # pushRecent/removePlace + MAX_RECENT_SEARCHES/MAX_SAVED_PLACES
        ├── safeFormat.ts         # safeFormat(dateStr, fmt) / safeFormatUnix(unix, fmt) → "N/A"
        └── speedInMpsToKmph.ts   # m/s → km/h string
```

**Folders that do NOT exist yet** (created by refactor spec): `types/`, `services/`, `hooks/`, `context/`-style providers beyond root layout.

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
