# Feature Spec: Favorites & Recent Cities

## Metadata

| Field | Value |
|---|---|
| Status | **done** (branch `feat/favorites-recent-cities`) |
| Priority | P1 |
| Depends on | [refactor-foundation.md](./refactor-foundation.md) recommended (queryKey pattern + types folder) — implementable without it but expect rework |
| Resolves | — |
| New dependencies | none (jotai's `atomWithStorage` ships with jotai ^2.12.5 via `jotai/utils`) |

> **Implementation notes (2026-08-25):** recents are written only on *actual city switches* (`selectPlace` in Navbar = submit flow + geolocation flow), not on bare suggestion clicks — clicking a suggestion only fills the input. PlacesBar mounts between `<Navbar/>` and `<main>` in `page.tsx`. A `mounted` guard prevents SSR/localStorage hydration mismatch. Recents chips hide entries that are already pinned (no duplicates across sections). Helpers live in `src/utils/recentSearches.ts` (`pushRecent`, `removePlace`, caps).

## Summary

Let users save favorite cities (pinned chips) and automatically track recent searches, both persisted in localStorage. Selecting any chip switches the active city instantly; the current location can be pinned/unpinned. This builds directly on the existing `placeAtom` flow — no new fetching logic required.

## User Stories

- As a user, I want to pin a city I check often so I can jump to it in one click.
- As a user, I want my recent searches remembered after refresh so I don't retype.
- As a user, I want to remove a favorite/recent entry so the list stays relevant.
- As a user, I want visual feedback for which city is currently active.

## Technical Design

### State changes (`src/app/atom.ts`)

```ts
import { atomWithStorage } from "jotai/utils";

export const savedPlacesAtom = atomWithStorage<string[]>("weather.savedPlaces", []);
export const recentSearchesAtom = atomWithStorage<string[]>("weather.recentSearches", []);
```

- Both store **city name strings** (matches `placeAtom`, which is a plain string today). If the refactor spec has landed and place becomes `{ name, lat, lon } | null`, upgrade these to the same shape.
- Cap `recentSearchesAtom` at 5 entries, most-recent-first, deduped.
- `savedPlacesAtom` order = pin order; cap at 10.

### Data mutations

Write sites:
- On successful city switch (submit or suggestion click in `Navbar.handleSubmitSearch` / `handleSuggestionClick`) → push to recents (dedupe, cap 5).
- Geolocation success (`handleCurrentLocation`) → push resolved city name to recents as well.
- Pin button on the *current* city → toggle membership in savedPlaces.

### UI changes

New component `src/components/PlacesBar.tsx` rendered directly under `Navbar` inside `page.tsx` main flow:

```
[ ★ Delhi × ] [ ★ Mumbai × ] │ [ London × ] [ Tokyo × ]
```

- Star chip = saved (filled star icon `lucide-react` `Star`); outline star = recent-only; click body → setPlace(name).
- Active city chip highlighted (`bg-white/30` vs `bg-white/10`, consistent with glass style).
- `×` removes from list (stopPropagation so chip click doesn't fire).
- Pin current city: add a `Star` button beside the unit toggle in `Navbar.tsx:132-137` area; filled when current place is saved.
- Empty state: render nothing (bar hidden) rather than an empty container.
- Mobile: horizontally scrollable row reusing `.scrollbar-hide`.

## Files to Create

```
src/components/PlacesBar.tsx    // chips row; default export
```

## Files to Modify

| File | Area | Change |
|---|---|---|
| `src/app/atom.ts` | whole file | add two `atomWithStorage` atoms |
| `src/components/Navbar.tsx` | :61-64, :94-112 | push to recents on selection paths |
| `src/components/Navbar.tsx` | :122-137 | add pin-current-city star button |
| `src/app/page.tsx` | below `<Navbar …>` (:157) | mount `<PlacesBar />` |

## Implementation Steps

1. [ ] Add both atoms with `atomWithStorage`; verify SSR safety (`atomWithStorage` is SSR-safe; initial render uses default until hydration).
2. [ ] Create `PlacesBar.tsx` reading atoms + `placeAtom`; wire click/remove/pin logic.
3. [ ] Mount bar in `page.tsx`.
4. [ ] Wire recents writes into Navbar submit/suggestion/geolocation flows.
5. [ ] Add pin toggle button in Navbar.
6. [ ] Style pass: glass chips, active state, mobile scroll.
7. [ ] A11y: chips are real `<button>`s with `aria-label="Switch to {name}"` and `aria-pressed={isActive}`.

## Acceptance Criteria

- [ ] Searching + selecting "London" adds London to recents; selecting again moves it to front (no dupes).
- [ ] Recents cap at 5; oldest drops off.
- [ ] Pinning current city adds a starred chip; unpinning removes it; survives refresh (localStorage keys `weather.savedPlaces`, `weather.recentSearches`).
- [ ] Clicking a chip switches weather data without full reload; loading skeleton shows during fetch.
- [ ] Removing the active city's chip does NOT change current view.
- [ ] No hydration warnings in console on first load.

## Verification Checklist

```bash
npm run lint && npm run build
npm run dev
```
Manual: search → select → refresh → chip persists → click chip → data swaps; test remove + pin; DevTools → Application → Local Storage shows both keys.

## Out of Scope

- Server-side sync/auth of saved places
- Renaming/reordering chips via drag
- Storing lat/lon per place (comes naturally if refactor changes place shape)
