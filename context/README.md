# Weather App — Context Folder

This folder is the **single source of truth** for humans and AI coding agents working on this project. It exists so that any agent (or new developer) can implement features correctly **without re-exploring the entire codebase**.

> Generated from a full codebase review on 2026-08-25. Line references are accurate as of commit `0f97960` ("forecast data map fix"). If you change a referenced file significantly, update these docs.

---

## File Index

| File | Read when... |
|---|---|
| [`project-overview.md`](./project-overview.md) | You need stack versions, file map, scripts, or env vars |
| [`architecture.md`](./architecture.md) | You need to understand data flow, state, component tree |
| [`api-reference.md`](./api-reference.md) | You're touching API calls, response types, or adding endpoints |
| [`conventions.md`](./conventions.md) | You're writing ANY new code (naming, styling, error patterns) |
| [`known-issues.md`](./known-issues.md) | Before/while implementing anything — don't build on broken code |
| [`roadmap.md`](./roadmap.md) | Planning what to build next; update status after shipping |
| [`features/TEMPLATE.md`](./features/TEMPLATE.md) | Starting a NEW feature not yet specced here |
| [`features/refactor-foundation.md`](./features/refactor-foundation.md) | **Read first** — prerequisite cleanup for all other specs |
| [`features/favorites-recent-cities.md`](./features/favorites-recent-cities.md) | Implementing saved/recent locations |
| [`features/dark-light-mode.md`](./features/dark-light-mode.md) | Implementing theming + persisted preferences |
| [`features/aqi-weather-maps.md`](./features/aqi-weather-maps.md) | Implementing air quality, charts, or radar map |

---

## Protocol for AI Agents

1. **Before writing code:** read `conventions.md` + `known-issues.md` + the relevant `features/*.md` spec. Skim `architecture.md` if the change touches data flow.
2. **Never re-introduce known bugs** listed in `known-issues.md`. If your change touches a buggy line anyway, fix it and check it off.
3. **Follow existing patterns over inventing new ones.** This codebase has deliberate conventions (default exports, `type Props`, Tailwind utility strings). See `conventions.md`.
4. **After finishing a feature:** move its spec status to `done` in `roadmap.md`, note resolved issues in `known-issues.md`, and add line refs for anything new worth documenting.
5. **Adding a brand-new feature?** Copy `features/TEMPLATE.md` to `features/<name>.md` and fill it out *before* coding.
6. **Verification is mandatory:** run `npm run lint` and `npm run build` before declaring done. There is no test suite yet — manual smoke-test checklist lives in each spec.

## Protocol for Humans

- Update `roadmap.md` statuses as work lands.
- When a bug is fixed, strike it / mark it fixed in `known-issues.md`.
- Keep this folder in git so agents get context from repo history.

---

## Quick Facts

```
Stack        Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind v4
State        Jotai atoms (src/app/atom.ts) + TanStack Query v5
HTTP         Axios, called directly from client components
Weather data OpenWeatherMap (key in .env.local as NEXT_PUBLIC_WEATHER_KEY)
Routes       Single route: "/" (src/app/page.tsx)
Tests        None yet
Run          npm run dev · Lint: npm run lint · Build: npm run build
```

## Current Feature Set

Current conditions hero (temp, feels-like, H/L), °C/°F toggle, city search with autocomplete suggestions, browser geolocation button, hourly strip (12 slots), 5-day forecast list, detail tiles (visibility/humidity/wind/pressure/sunrise/sunset), loading skeleton, animated glassmorphism UI.

**Not present:** favorites, recent searches, persistence (any), dark mode, AQI, charts, maps, i18n, PWA, tests, error boundaries.
