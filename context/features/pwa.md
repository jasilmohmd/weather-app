# Feature Spec: PWA Manifest + Offline Shell

## Metadata

| Field | Value |
|---|---|
| Status | **done** (branch `feat/pwa`) |
| Priority | P2 |
| Depends on | — (builds on key-proxy's `/api` shape for offline API caching) |
| Resolves | roadmap backlog "PWA manifest + offline shell" |
| New dependencies | none (hand-rolled service worker) |

## Summary

Installable PWA with an app manifest and a dependency-free service worker providing an offline shell: navigations fall back to cached pages → styled offline card; `/api/*` responses are cached so recently viewed cities render offline; hashed static assets are cache-first.

## Technical Design

### Manifest (`src/app/manifest.ts`)
Next App Router metadata route → serves `/manifest.webmanifest` as `application/manifest+json`. Name/short_name "Weather (App)", `display: standalone`, amber/orange theme colors, two icon entries pointing at `public/icon.svg` (purpose any + maskable).

**Icon:** hand-authored SVG (gradient rounded square + ⛅ glyph). SVG icons are accepted by modern Chromium/Safari launchers; if Play Store-grade assets are ever needed, generate 192/512 PNGs from it.

### Service worker (`public/sw.js`) — versioned caches
- `weather-static-v1`: navigations (network-first → cached page → `/offline.html`) and static assets (cache-first).
- `weather-api-v1`: `/api/*` responses network-first with stale fallback; total miss returns HTTP 503 `{ message: "You appear to be offline." }` which the existing axios error path renders.
- `activate` purges old versions; `skipWaiting` + `clients.claim` for fast adoption.
- **Bump `VERSION` on every deploy** to invalidate caches.
- Skips non-GET, cross-origin, and `/sw.js` itself.

### Registration (`src/components/PwaRegister.tsx`)
Registers `/sw.js` after window load, **production only** (dev HMR would fight the SW). Mounted in layout beside `<ThemeSync />`.

### Metadata
`viewport.themeColor = #fb923c`; `metadata.appleWebApp { capable, title "Weather", black-translucent }`. Next auto-links the manifest from `app/manifest.ts`.

## Files

```
public/icon.svg            public/offline.html          public/sw.js
src/app/manifest.ts        src/components/PwaRegister.tsx
```

## Verification (all passed)

- Build lists `/manifest.webmanifest` as static route
- Prod server smoke test: manifest JSON correct (name/display/icons/start_url, content-type `application/manifest+json`); sw.js 200; offline.html 200; home HTML contains manifest link + theme-color meta
- 44/44 tests · lint · build all clean

## Gotchas for future agents

1. PowerShell 5.1 treats unknown content-types as byte arrays — decode `[Text.Encoding]::UTF8.GetString($r.Content)` before parsing JSON in smoke scripts.
2. Never register the SW in dev (`NODE_ENV !== 'production'` guard) — it caches chunk URLs that change every HMR rebuild.
3. A running dev/prod server locks `.next` on Windows; stop it before `next build`.

## Out of Scope / Follow-ups

- PNG icon set generation (192/512) for stricter launchers
- Background sync / push notifications
- Offline indicator banner in-app when navigator.onLine is false
