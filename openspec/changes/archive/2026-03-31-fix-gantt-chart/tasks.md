## 1. Fix Gantt Container Height in kanban-app.tsx

- [x] 1.1 Change the outer wrapper div around `<GanttChartComponent>` from `className="flex-1 overflow-auto"` to `className="flex-1 overflow-hidden"` so the gantt chart receives a definite height from flexbox

## 2. Fix Sticky Date Header in gantt-chart.tsx

- [x] 2.1 Add `sticky top-0 z-20 bg-background` to the header row's `<div className="flex">` wrapper so the date axis stays pinned during vertical scroll while remaining inside the single scroll container (preserving horizontal scroll sync)
