## ADDED Requirements

### Requirement: Board uses a dark sidebar rail with a light content area
The system SHALL render a narrow dark sidebar on the left and a light-background content area for the board. The sidebar MUST contain icon-based navigation and a settings entry point.

#### Scenario: Sidebar renders on board load
- **WHEN** a user loads the engineering kanban board
- **THEN** the system displays a dark sidebar rail on the left with icon links and the board content fills the remaining viewport width

### Requirement: Work items render as slim inline rows instead of bordered cards
The system SHALL display each work item as a compact inline row with a left-edge priority color accent, title text, and assignee initial. Visible borders around individual items MUST be removed.

#### Scenario: Board column shows inline work item rows
- **WHEN** a user views a board column containing work items
- **THEN** each item appears as a single-line row with priority accent, title, and assignee — without a visible card border

### Requirement: Board columns use minimal visual containers
The system SHALL render board columns without heavy rounded card containers. Columns MUST be visually separated by whitespace and a subtle divider or background tint rather than bordered boxes.

#### Scenario: Columns render without card-style borders
- **WHEN** a user views the engineering board
- **THEN** each column is visually distinct through spacing and background tint, not through bordered card wrappers

### Requirement: Typography and spacing follow a defined hierarchy
The system SHALL use a consistent type scale and spacing system where column headers are prominent, item titles are medium weight, and metadata is subdued — achieving visual hierarchy without relying on card borders.

#### Scenario: Visual hierarchy is readable at a glance
- **WHEN** a user scans the board
- **THEN** column names, item titles, and metadata are distinguishable by font size and weight alone
