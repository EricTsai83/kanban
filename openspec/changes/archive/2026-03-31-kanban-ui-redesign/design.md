## Context

The existing kanban board works but its visual language relies almost entirely on bordered cards (`rounded-3xl border border-zinc-200 bg-white shadow-sm`) at every level — header, controls section, each column, and every work item. The result is a dense grid of rounded rectangles that competes for attention instead of guiding the eye. The board controls, column config, and item form are always visible, consuming valuable viewport space.

The user has asked for an innovative, less card-heavy design. The tech stack is Next.js 16 + Tailwind CSS 4 + Shadcn UI + Lucide Icons. No data model or API changes are needed; this is a pure presentation rewrite.

## Goals / Non-Goals

**Goals:**
- Achieve a distinctive, modern aesthetic that feels closer to Linear/Raycast than to a generic Trello clone.
- Eliminate visual noise by removing most visible card borders and relying on whitespace, subtle background tints, and typographic weight to create hierarchy.
- Maximize board real estate by moving secondary UI (filters, column config, item form) into overlays and drawers that appear on demand.
- Add tasteful motion — column drop-zone highlights, item hover expansion, and slide-over transitions — to communicate interactivity.
- Keep the implementation in a single `kanban-app.tsx` replacement plus minor layout/CSS updates.

**Non-Goals:**
- Building a shared component library or design tokens package.
- Changing any API route, data model, or persistence logic.
- Adding new features beyond the current capability set.

## Decisions

### Decision: Use a dark sidebar rail + light content area layout

Replace the current full-width zinc-50 background with a narrow dark sidebar (slate-950) holding a minimal icon rail, and a light content well for the board.

Rationale: Gives the product a distinctive premium feel (similar to Linear) and frees up the top of the viewport currently consumed by the header card.

Alternatives considered:
- Keep a top header bar: familiar, but wastes vertical space and looks like every other SaaS tool.
- Full dark mode: polarizing and harder to read dense board content.

### Decision: Replace bordered work item cards with inline rows

Each work item becomes a slim single-line row with priority color accent on the left edge, title, assignee avatar initial, and a hover state that reveals metadata. Clicking opens a slide-over detail panel.

Rationale: Dramatically reduces visual weight — a column of 10 items now scans like a list, not a stack of boxes. The detail panel provides space for full metadata without cluttering the board.

Alternatives considered:
- Keep cards but remove borders: still feels boxy when stacked.
- Tooltip on hover: too transient for editing operations.

### Decision: Replace filter bar with a command-bar overlay

Filters, grouping, and search collapse into a single command-bar triggered by a keyboard shortcut or toolbar icon, inspired by Spotlight / Raycast.

Rationale: Removes the permanent 5-select filter row from the board surface. Filters are used intermittently, so on-demand access is a better trade-off than permanent visibility.

Alternatives considered:
- Collapsible filter row: still consumes a full row even when collapsed.
- Side filter panel: competes with the detail slide-over.

### Decision: Column config and board settings move into a settings drawer

The current `<details>` accordion for column management becomes a slide-in drawer from the right, accessible from a gear icon in the sidebar.

Rationale: Column configuration is infrequent. Keeping it in a drawer removes cognitive load from the main board surface.

### Decision: Use Shadcn UI primitives and Lucide Icons

Leverage Shadcn's Dialog, Sheet (slide-over), Command (command palette), and Button components for consistent motion and accessibility. Use Lucide for all icons.

Rationale: The project already lists Shadcn UI and Lucide Icons in its tech stack but the current implementation uses none. Adopting them gives polished interaction patterns for free.

Alternatives considered:
- Custom components from scratch: more control, but slower and less accessible.

## Risks / Trade-offs

- [Shadcn dependency install] → Need to run `npx shadcn@latest init` and add specific components. Follow latest Shadcn docs for Next.js 16 compatibility.
- [Keyboard shortcut conflicts] → Keep command-bar shortcut simple (Cmd+K) and allow click fallback.
- [Inline rows may feel too compact on mobile] → Add responsive breakpoints that fall back to slightly taller row padding on small screens.
- [Slide-over detail panel on small screens] → Render as full-screen modal below the `lg` breakpoint.

## Migration Plan

1. Install Shadcn UI + required components (Sheet, Command, Dialog, Button).
2. Add Lucide Icons dependency.
3. Update `globals.css` with new custom properties and animation keyframes.
4. Update `layout.tsx` to include a sidebar rail shell.
5. Rewrite `kanban-app.tsx` with the new visual system.
6. Verify all existing spec scenarios still pass (board creation, column config, item CRUD, drag-and-drop, filters, grouped views, indicators).

Rollback: revert the single component file and layout changes; API layer is untouched.

## Open Questions

- Should the sidebar include navigation links to future pages (e.g., settings, team) or remain a minimal icon rail for now?
- Preferred accent color palette — keep sky-600 or shift to indigo/violet for a fresher feel?
