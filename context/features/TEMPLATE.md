# Feature Spec: <Feature Name>

> Copy this file to `context/features/<kebab-case-name>.md` and fill it out BEFORE implementing. Delete section hints as you go. Keep line refs pointing at current source so agents can navigate fast.

## Metadata

| Field | Value |
|---|---|
| Status | planned · in-progress · done |
| Priority | P0–P3 |
| Depends on | other spec(s)/issues or "—" |
| Resolves | known-issue IDs from `known-issues.md` (e.g. B3, A1) |
| New dependencies | none · list packages w/ versions |

## Summary

One paragraph: what this feature does and why.

## User Stories

- As a **user**, I want ___ so that ___.
- As a **user**, I want ___ so that ___.

## Technical Design

### State changes
- Atoms added/changed (use jotai `atomWithStorage` for persistence):
```ts
// src/app/atom.ts (or new file if scoped)
```

### API changes
- Endpoints called/added; request/response shapes; link `../api-reference.md` sections.

### UI changes
- Where components mount; visual description; interaction details (hover/focus/empty/loading/error states).

## Files to Create

```
src/components/Xyz.tsx        // purpose
src/utils/abc.ts              // purpose
```

## Files to Modify

| File | Lines/Area | Change |
|---|---|---|
| `src/app/page.tsx` | ~:101-110 | e.g. add to queryKey |
| `src/components/Navbar.tsx` | :122 | e.g. new button |

## Implementation Steps

Ordered checklist — each step should leave the app buildable:

1. [ ] …
2. [ ] …

## Acceptance Criteria

- [ ] Given ___, when ___, then ___.
- [ ] Loading state renders ___.
- [ ] Error state renders ___.
- [ ] Empty state renders ___.
- [ ] Works on mobile viewport (<768px uses mobile search row).

## Verification Checklist

```bash
npm run lint     # zero errors
npm run build    # succeeds
npm run dev      # manual smoke test below
```

Manual:
- [ ] Search for a city → data updates
- [ ] Toggle °C/°F → all temps change consistently
- [ ] Geolocation button → nearest city loads
- [ ] Refresh page → persisted state survives (if applicable)

## Out of Scope

- Explicitly list tempting adjacent work NOT included.

## Open Questions

- …
