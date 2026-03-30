## Why

Cards and list rows currently display dates as raw `YYYY-MM-DD` strings (e.g. `2026-04-15`), which is harder to scan than a human-readable format and provides no visual feedback about urgency or overdue status.

## What Changes

- Replace raw `YYYY-MM-DD` date strings with locale-aware, human-readable labels on kanban cards and list view rows
- Introduce overdue and upcoming visual cues (color-coded badge) on due dates
- Add relative labels for today / tomorrow / yesterday
- Ensure formatted dates respect the active locale (English / 繁體中文)

## Capabilities

### New Capabilities

- `card-date-display`: Formatted, locale-aware due date rendering with overdue/upcoming color cues on kanban cards and list view rows

### Modified Capabilities

- `engineering-board-views`: Due date column in list view now renders formatted labels instead of raw strings

## Impact

- `components/kanban-app.tsx` — update card badge and list row date rendering
- `lib/i18n.ts` — add locale strings for "Today", "Tomorrow", "Yesterday", and date format patterns
- No data model changes; stored format remains `YYYY-MM-DD`

## Non-goals

- Changing the stored date format in the data model
- Adding date pickers or editing UX changes
- Relative time beyond yesterday/today/tomorrow (e.g. "3 days ago")
