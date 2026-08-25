# Feature Spec: Search Debounce + Keyboard Accessible Suggestions

## Metadata

| Field | Value |
|---|---|
| Status | **done** (branch `feat/search-debounce-keyboard`) |
| Priority | P1 |
| Depends on | refactor-foundation (Navbar structure) |
| Resolves | A6 (per-keystroke API burn), ♿ accessibility batch (suggestions keyboard support, icon-button labels, input label, emoji alt text) |
| New dependencies | none |

## Summary

Debounce the autocomplete request (300 ms) with stale-response guarding, make the suggestion dropdown fully keyboard operable (↑/↓/Enter/Escape), and close the accessibility gaps on icon-only controls and emoji weather icons.

## Technical Design

### Debounce (`Navbar.tsx`)
- `debounceRef` timer: 300 ms after last keystroke before calling `findCities`; cleared on new input and on unmount.
- `requestSeqRef` sequence counter: late responses from old queries are discarded (`seq !== requestSeqRef.current → return`) so fast typing can't render stale suggestions.
- Clearing below 4 chars cancels pending work immediately (bumps sequence, clears error).

### Keyboard interaction
- Keydown handler lives on the search wrapper divs (input focus bubbles) — both desktop and mobile instances share it.
- `ArrowDown/ArrowUp`: move `activeIndex` cyclically; `Enter` with an active row selects it AND switches city (canonical name from `/find`, prevents form submit); `Escape` closes the dropdown.
- `SuggestionBox` renders `role="listbox"` / `role="option"` buttons with `aria-selected`; active row highlighted via class.

### Labels / alt text
- Geolocation button: `aria-label="Use my current location"`
- Unit toggle: `aria-label="Switch to degrees Fahrenheit|Celsius"`
- Search input: `aria-label="Search location"` · submit button: `aria-label="Search"` + explicit `type="submit"`
- `WeatherIcon`: `role="img"` + readable names per OWM code via `ICON_NAMES` ("Sunny", "Clear night", "Partly cloudy night", …)

## Files Changed

| File | Change |
|---|---|
| `src/components/Navbar.tsx` | debounce, seq guard, keyboard handler, activeIndex wiring, button labels |
| `src/components/Searchbox.tsx` | input aria-label, submit type+label |
| `src/components/WeatherIcon.tsx` | ICON_NAMES map, role=img |

## Acceptance Criteria

- [ ] Typing fires at most one suggestion request per 300 ms pause (network tab).
- [ ] Rapid typing never shows results from an older query.
- [ ] ↑/↓ cycles suggestions; highlighted row visible; Enter switches to that city; Escape closes.
- [ ] All icon-only buttons discoverable by screen readers; weather emojis announce their condition.
- [ ] Lint/build clean.

## Out of Scope / Future Polish

- Full ARIA combobox wiring (aria-expanded/activedescendant on the input itself)
- Debounce indicator spinner in the input
