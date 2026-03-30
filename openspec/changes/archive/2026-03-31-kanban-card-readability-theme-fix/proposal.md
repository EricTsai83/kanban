## Why

The kanban board is hard to scan at a glance. Work item rows only show a title, a tiny priority bar, a priority badge, and an assignee initial — all other metadata (assignee full name, labels, estimate, due date, blocked status) is hidden behind hover-expand and invisible until the user mouses over each row individually. This forces users to either hover every card or click into the detail panel just to understand the board state.

Separately, the theme toggle has two bugs: (1) it uses `theme` (the user's preference string — "light", "dark", "system") instead of `resolvedTheme` (the actual applied theme), so the icon and tooltip don't reflect what the user actually sees; (2) cycling from "system" to "light" often appears to do nothing because the OS is already in light mode, making the toggle feel broken.

## What Changes

- Redesign `WorkItemRow` to always show key metadata inline — assignee name (not just initial), labels (as small badges), estimate, and due date — without requiring hover.
- Remove the hover-expand behavior entirely; all scannable metadata is now permanently visible on each row.
- Keep the priority color bar, priority badge, and blocked icon as-is.
- Fix `cycleTheme` to use `resolvedTheme` to determine icon and tooltip, so the visual state always matches what the user sees.
- Fix the cycling order so it feels responsive: always show Sun/Moon based on resolved state, and show Monitor only when the user explicitly selects "system".

## Capabilities

### New Capabilities

- `work-item-row-readability`: Defines what information each work item row must display at all times (without interaction) and how metadata is laid out.
- `theme-toggle-behavior`: Defines the correct cycling logic, icon mapping, and tooltip text for the light/dark/system theme toggle.

### Modified Capabilities

None.

## Impact

- `components/kanban-app.tsx` — rewrite `WorkItemRow` layout, update `cycleTheme` and `themeIcon` functions.
- No changes to data model, API routes, or persistence.
- No new dependencies.

## Non-goals

- Redesigning the overall board layout, sidebar, or column structure.
- Adding new metadata fields to work items.
- Changing theme color palettes or CSS variables.
