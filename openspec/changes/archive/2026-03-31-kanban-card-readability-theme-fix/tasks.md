## 1. Work Item Row Readability

- [x] 1.1 Rewrite `WorkItemRow` — remove hover-expand panel, convert metadata into a permanently visible second line showing: assignee name, label badges (max 2 + overflow count), estimate, due date, and blocked badge
- [x] 1.2 Remove `hoveredId` state and all `onHoverStart`/`onHoverEnd` handlers from `KanbanApp` and `WorkItemRow` props
- [x] 1.3 Handle edge cases — "Unassigned" fallback when no assignee, truncation for long names, "+N" indicator when labels > 2

## 2. Theme Toggle Fix

- [x] 2.1 Update `themeIcon` to use `resolvedTheme` instead of `theme` — show Sun for light, Moon for dark, Monitor only before mount
- [x] 2.2 Update tooltip text — show "Light", "Dark", or "System (light)"/"System (dark)" depending on preference vs resolved state
- [x] 2.3 Update `cycleTheme` to cycle based on current `theme` preference: light → dark → system → light (keep same order, but ensure the resolved state drives the icon so the user sees a change)

## 3. Verification

- [x] 3.1 Run `npm run lint` and `npm run build` — fix any errors
