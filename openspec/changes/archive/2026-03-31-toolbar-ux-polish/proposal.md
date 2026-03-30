## Why

The board toolbar has grown organically and now contains a view mode switcher, a density/gantt switcher, a language selector, a filter button, and a new-item button — all in one horizontal strip with no visual grouping. The user avatar in the sidebar is rendered as initials-only with hand-rolled positioning; upgrading to Shadcn `Avatar` provides a consistent fallback image, accessible alt text, and a standard component pattern already present in the design system.

## What Changes

- Reorganise the toolbar: group related controls (view mode + density) together with a visual separator from action buttons (filter, new item)
- Remove the language selector from the toolbar and move it to the settings panel (reduces toolbar clutter)
- Tooltip labels on every icon-only toolbar button
- Replace the hand-rolled initials avatar in `UserMenu` with Shadcn `Avatar` / `AvatarFallback`
- User avatar in the sidebar shows initials via `AvatarFallback` and supports a future `AvatarImage` when a real photo URL is available

## Non-goals

- No changes to the underlying view modes or density logic
- No design-system changes beyond using the existing `Avatar` component
- No backend or auth changes
- Language switching is not removed, only relocated to settings

## Capabilities

### New Capabilities
- `toolbar-layout`: Visual grouping and tooltip coverage of all toolbar controls; language selector relocated to settings sheet

### Modified Capabilities
- `view-mode-switcher`: Tooltip labels added to all icon buttons; active state remains `secondary` variant

## Impact

- `components/kanban-app.tsx`: toolbar JSX restructured; language switcher moved inside settings sheet
- `components/auth/user-menu.tsx`: replace initials `<button>` with Shadcn `<Avatar>` + `<AvatarFallback>`
- Shadcn `Avatar` component added via `npx shadcn@latest add avatar` (or manual copy)
