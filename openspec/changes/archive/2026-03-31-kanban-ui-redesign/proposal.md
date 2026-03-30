## Why

The current kanban UI is functional but visually cluttered and generic. Every piece of information is displayed as a bordered card, resulting in a wall of rectangles that fatigues the eye and makes it hard to scan the board at a glance. Engineers and leads need a clean, confident interface that uses space, typography, and subtle motion instead of heavy card borders to communicate hierarchy.

## What Changes

- Replace the card-heavy board layout with a minimal, high-density column design that uses whitespace and typographic hierarchy instead of visible borders around every item.
- Introduce a dark-themed sidebar navigation with a collapsible rail so the board occupies maximum screen real estate.
- Redesign work item rows as slim, borderless inline entries that expand into a slide-over detail panel instead of a sticky sidebar form.
- Add micro-interactions: smooth column drag highlights, item hover reveals, and transition animations on state changes.
- Replace the current filter/group bar with a unified command-bar style search and filter overlay.
- Consolidate the "Board controls" and "Configure workflow columns" sections behind a settings drawer to reduce always-visible UI chrome.

## Capabilities

### New Capabilities

- `kanban-visual-system`: Define the new visual language — color palette, type scale, spacing tokens, and dark/light surface system used across all kanban views.
- `kanban-interaction-layer`: Slide-over detail panel, command-bar filter overlay, column drag feedback, and item hover/expand micro-interactions.

### Modified Capabilities

None.

## Impact

- Full rewrite of `components/kanban-app.tsx` — the main board shell, column layout, work item rendering, filtering controls, and item form.
- Updates to `app/globals.css` for new CSS custom properties and animation keyframes.
- Updates to `app/layout.tsx` for sidebar navigation shell.
- No changes to API routes or data model — this is a pure presentation-layer change.

## Non-goals

- Changing the data model, API routes, or persistence layer.
- Adding new functional features such as sub-tasks, comments, or activity feeds.
- Implementing a full design-system component library — this change is scoped to the kanban workspace only.
