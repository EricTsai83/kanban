## Why

The Gantt chart view is currently broken — the chart renders as a collapsed zero-height container and bars/milestones are not visible. This is a regression that blocks any demo or usage of the gantt view.

## What Changes

- Fix the height-collapse layout bug: remove the `overflow-auto` wrapper in `kanban-app.tsx` that prevents `GanttChart`'s `h-full` from resolving
- Fix the `TooltipTrigger` `render` prop usage so gantt bars and milestone diamonds render correctly and are clickable
- Fix the sticky date header so it remains visible when scrolling vertically through many rows

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `gantt-chart-view`: Fix rendering so bars, milestones, and the date header all display correctly; gantt chart must fill the available viewport height

## Impact

- `components/gantt-chart.tsx` — layout and tooltip trigger fixes
- `components/kanban-app.tsx` — remove double `overflow-auto` wrapping the gantt view

## Non-goals

- No new gantt features (grouping, zoom levels, drag-to-reschedule)
- No changes to gantt data model or filtering logic
