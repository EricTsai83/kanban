## ADDED Requirements

### Requirement: Work item rows always display key metadata

Each work item row on the kanban board SHALL display the following information at all times, without requiring hover or click interaction:

- **First line**: priority color bar, title, blocked icon (if blocked), priority badge, assignee avatar circle.
- **Second line**: assignee name, label badges (up to 2 visible), estimate (if set), due date (if set).

#### Scenario: Row displays metadata without hover

- **WHEN** a work item exists with assignee "Alice", labels ["frontend", "api", "docs"], estimate 5, and due date "2026-04-15"
- **THEN** the row SHALL display "Alice" as text, two label badges ("frontend", "api") with a "+1" overflow indicator, "5 pts", and "2026-04-15" in the second line — all visible without any hover interaction

#### Scenario: Row without optional metadata

- **WHEN** a work item has no assignee, no labels, no estimate, and no due date
- **THEN** the second line SHALL show "Unassigned" and no other metadata elements

#### Scenario: Row with blocked status

- **WHEN** a work item is marked as blocked
- **THEN** a destructive "Blocked" badge SHALL be visible in the second line in addition to other metadata

### Requirement: Hover-expand behavior is removed

The `WorkItemRow` component SHALL NOT use a hover-expand panel to reveal metadata. All scannable metadata MUST be permanently visible.

#### Scenario: No hidden metadata on hover

- **WHEN** user hovers over a work item row
- **THEN** no additional metadata panel SHALL expand or become visible — the row content remains the same as in its non-hovered state

### Requirement: Long content is truncated gracefully

The work item row SHALL handle overflow for long assignee names and numerous labels without breaking the layout.

#### Scenario: Long assignee name is truncated

- **WHEN** an assignee name exceeds the available width
- **THEN** the name SHALL be truncated with an ellipsis

#### Scenario: Many labels show overflow count

- **WHEN** a work item has more than 2 labels
- **THEN** the row SHALL display the first 2 labels as badges and a "+N" indicator showing the count of remaining labels
