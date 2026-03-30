## Context

The `WorkItemRow` component in `kanban-app.tsx` renders each work item as a slim inline row. Currently, the main row shows only: a 1px priority color bar, a truncated title, a blocked icon (conditional), a priority badge, and an assignee initial circle. All other metadata — assignee full name, labels, estimate, due date — is hidden behind a hover-expand panel (`max-h-0 → max-h-24` on `mouseEnter`). This makes the board impossible to scan without individually hovering every item.

The theme toggle cycles through light → dark → system using the `theme` value from `next-themes`, but `theme` represents the user's *preference* (e.g., "system"), not the *resolved* visual state. When OS preference matches the current mode, toggling appears to do nothing.

## Goals / Non-Goals

**Goals:**

- Make every work item row display enough metadata to scan the board without hovering or clicking — specifically: assignee name, labels, estimate, and due date.
- Fix the theme toggle so its icon and tooltip always reflect the actual visible theme, and cycling always produces a visible change.

**Non-Goals:**

- Redesigning the board layout, sidebar, or column structure.
- Changing the data model or adding new fields.
- Modifying theme palettes or CSS variables.

## Decisions

### Decision 1: Show metadata in a second line on every row (always visible)

**Choice**: Convert the hover-expand section into a permanently visible second line. The first line stays the same (priority bar, title, blocked icon, priority badge, assignee avatar). The second line shows: assignee name, labels as small badges, estimate, and due date — all in compact form.

**Why**: A two-line card is a standard pattern in tools like Linear, Jira, and GitHub Projects. It gives enough room for metadata without making each row too tall. The previous hover-expand approach broke scannability because users couldn't see metadata until they interacted.

**Alternatives considered**:
- Single-line with more inline elements — too cramped, would truncate everything at narrow column widths.
- Three-line card — unnecessary vertical space; two lines is sufficient for the key metadata.

### Decision 2: Replace assignee initial circle with name text

**Choice**: Show the full assignee name (or "Unassigned") as text in the second line instead of just a single-letter circle. Keep the circle on the first line as a visual anchor, but add the name to the second line.

**Why**: A single letter is ambiguous when multiple team members share the same initial. The full name in the metadata line resolves this.

### Decision 3: Use `resolvedTheme` for icon and tooltip, keep `theme` for cycling logic

**Choice**: Use `resolvedTheme` from `useTheme()` to determine which icon (Sun/Moon) to show and what the tooltip says. Use `theme` to determine cycling logic so the user can still explicitly choose "system" mode.

**Why**: `resolvedTheme` reflects what the user actually sees (always "light" or "dark"), while `theme` includes "system" as a valid preference. The icon should match the visual state (Sun for light, Moon for dark). The tooltip should show the preference (e.g., "System (light)") so the user knows they're in auto mode.

**Alternatives considered**:
- Use only `resolvedTheme` for everything — loses the ability to show "system" as an explicit state.
- Keep current approach — broken UX as described.

### Decision 4: Improved cycling order: light → dark → system

**Choice**: Keep the same cycle order (light → dark → system → light) but show the resolved state alongside the preference in the tooltip: "Light", "Dark", "System (dark)".

**Why**: The Monitor icon for "system" makes sense as a concept, but the tooltip must clarify what theme is actually active. This removes the confusion of "I clicked but nothing changed."

## Risks / Trade-offs

- **Risk: Taller rows reduce visible items per column** → Acceptable trade-off; the metadata line is compact (~20px) and dramatically improves scannability. With the current hover-expand, the rows are the same height when hovered anyway.
- **Risk: Long assignee names or many labels overflow** → Mitigation: truncate assignee name with `truncate` class, limit visible labels to 2 with a `+N` overflow indicator.
