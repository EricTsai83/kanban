## Context

The Gantt chart component (`components/gantt-chart.tsx`) uses a `flex h-full flex-col` root div, relying on its parent to supply a definite height so `h-full` resolves. In `kanban-app.tsx`, the gantt is wrapped in `<div className="flex-1 overflow-auto">`. An `overflow-auto` element acts as a scroll container; its flex children are sized by content, not by the parent's dimensions — so `h-full` inside resolves to 0 and the chart collapses.

A second issue exists inside `gantt-chart.tsx`: the date header row is placed inside the scroll container, so it scrolls away when the user scrolls vertically through many rows.

A third issue is the `TooltipTrigger render={<button />}` pattern: in Base UI v1.3, when `render` receives a React element, Base UI clones it with merged props including `children`. The children of `<TooltipTrigger>` (the diamond div or sr-only span) are merged in as the `children` prop. For bars this works because the button is self-contained (its background IS the bar). For milestones the diamond is a child — it is forwarded correctly by cloneElement. The visible bug is purely the layout collapse; once height is restored the bars become visible.

## Goals / Non-Goals

**Goals:**
- Gantt chart fills the available viewport height with correct scrolling
- Date header stays visible (sticky) while rows scroll vertically
- No gantt-specific regressions in other view modes

**Non-Goals:**
- No change to gantt data model, filtering, or business logic
- No visual redesign beyond making existing design visible

## Decisions

### 1. Remove outer `overflow-auto` wrapper in `kanban-app.tsx`

Current:
```tsx
<div className="flex-1 overflow-auto">
  <GanttChartComponent ... />
</div>
```

Fix: change to `overflow-hidden` (or just `flex-1`) so the div has a defined height from flexbox and does not become a scroll container. `GanttChart` manages its own scrolling internally.

```tsx
<div className="flex-1 overflow-hidden">
  <GanttChartComponent ... />
</div>
```

**Alternatives considered:**
- Give `GanttChart` a fixed height: rejected — breaks responsive layouts
- Use `min-h-0` trick: works but `overflow-hidden` is more explicit about intent

### 2. Hoist date header out of scroll container

Move the header row above the scroll container so it is not affected by vertical scroll. The scroll container then only contains item rows.

```tsx
<div className="flex h-full flex-col">
  {/* fixed header — outside scroll */}
  <div className="flex shrink-0" ...>
    <div {/* label column */} />
    <div {/* timeline header */}>
      {ticks} {todayMarker}
    </div>
  </div>
  {/* scrollable rows */}
  <div className="flex-1 overflow-auto">
    {dated.map(...)}
  </div>
</div>
```

Both the fixed header and each row must share the same `LABEL_WIDTH + timelineWidth` so columns stay aligned. The header label cell gets `shrink-0` and `border-b`.

## Risks / Trade-offs

- [Horizontal scroll sync] Header and rows are in separate DOM containers, so horizontal scroll must be kept in sync. **Mitigation:** Wrap both in a single `overflow-auto` horizontal scroller, with the header inside but the item rows also inside that same container. Use `sticky top-0` on the header row to keep it pinned during vertical scroll only.
  - Revised approach: keep everything in ONE scroll container; make the header row `sticky top-0 z-20` rather than hoisting it out. This naturally syncs horizontal scroll and pins the header vertically.
