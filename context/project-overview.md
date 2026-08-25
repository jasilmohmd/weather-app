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
| `NEXT_PUBLIC_WEATHER_KEY` | `.env.local` | OpenWeatherMap key. `NEXT_PUBLIC_` prefix = shipped to browser by design. ⚠️ Also hardcoded in a comment at `src/app/page.tsx:22`. `.env*` is gitignored; no `.env.example` exists yet. |

## Full File Map

```
weather-app/
├── .env.local                    # OWM API key (gitignored)
├── eslint.config.mjs             # FlatCompat → next/core-web-vitals + next/typescript
├── next.config.ts                # images.remotePatterns: openweathermap.org/** (currently unused)
├── postcss.config.mjs            # @tailwindcss/postcss
├── tsconfig.json                 # strict, alias @/* → ./src/*
├── package.json                  # see scripts above
├── public/                       # stock create-next-app SVGs only
└── src/
    ├── app/
    │   ├── globals.css           # ONLY "@import \"tailwindcss\";" — no theme tokens yet
    │   ├── layout.tsx            # RootLayout ('use client'): Geist fonts + QueryClientProvider
    │   ├── page.tsx              # ⚠️ 455-line monolith: OWM types (:24-91), fetch (:101),
    │   │                         #    full home UI (:146-317), WeatherSkeleton (:320-455)
    │   ├── atom.ts               # placeAtom, loadingCityAtom, isCelsiusAtom (7 lines)
    │   └── favicon.ico
    ├── components/               # all default-exported PascalCase .tsx
    │   ├── Container.tsx         # glass-card wrapper (bg-white/10 backdrop-blur-3xl …)
    │   ├── Footer.tsx            # static credits card
    │   ├── ForecastWeatherDetails.tsx  # one row of daily forecast + compact details grid
    │   ├── Navbar.tsx            # location name/date, geolocation btn, unit toggle,
    │   │                         #    desktop+mobile Searchbox, internal SuggestionBox (:190)
    │   ├── Searchbox.tsx         # controlled form input + submit icon (uses cn())
    │   ├── WeatherDetails.tsx    # 6 detail tiles; also named-export CompactWeatherDetails
    │   └── WeatherIcon.tsx       # OWM icon-code → emoji map, ☀️ fallback
    └── utils/                    # camelCase plain-function modules
        ├── cn.ts                 # clsx + tailwind-merge
        ├── convertKelvinToCelcius.ts  # convertKtoC (floor), convertKtoF (round) ⚠️ inconsistent
        ├── getDayOrNightIcon.tsx # swaps trailing d/n based on 06–18h window
        ├── metersToKilometers.ts # m → km string (toFixed(0))
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
- Contains exactly `@import "tailwindcss";` — Tailwind v4 CSS-first style. Theme tokens/dark variants would be defined here via `@theme` (see dark-mode spec).

## Git Context

~8 commits, tutorial-following history ("type error fix", "z index fix for search city suggestions", "date and time format fix"). Latest at review: `0f97960`.
