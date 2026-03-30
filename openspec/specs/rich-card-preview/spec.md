### Requirement: Card preview uses vertical card layout instead of inline row

Each work item in the board column view SHALL render as a vertical card with distinct sections stacked top-to-bottom: optional cover image, title area, description snippet, and metadata footer.

#### Scenario: Card with all metadata populated
- **WHEN** a work item has a cover image, description, assignee, labels, estimate, due date, and is not blocked
- **THEN** the card SHALL display from top to bottom: cover image (120px), title with priority indicator, description snippet (max 2 lines truncated), and a metadata footer with labels, assignee avatar, due date badge, and estimate badge

#### Scenario: Card with minimal metadata
- **WHEN** a work item has only a title and priority (no description, no assignee, no labels, no cover image)
- **THEN** the card SHALL display the title with priority indicator and the metadata footer area SHALL be minimal or hidden

### Requirement: Card displays description snippet

The card preview SHALL show the first 2 lines of the description text below the title, truncated with ellipsis if longer.

#### Scenario: Short description fits within 2 lines
- **WHEN** a work item has a description shorter than 2 lines
- **THEN** the full description text SHALL be visible in the card preview

#### Scenario: Long description is truncated
- **WHEN** a work item has a description longer than 2 lines
- **THEN** only the first 2 lines SHALL be visible, with text-overflow ellipsis applied via CSS line-clamp

#### Scenario: No description
- **WHEN** a work item has an empty description
- **THEN** the description area SHALL not be rendered, and the card layout SHALL collapse without leaving a gap

### Requirement: Card metadata footer displays badges and indicators

The bottom section of the card preview SHALL display relevant metadata as compact badges and indicators.

#### Scenario: Labels are displayed as colored badges
- **WHEN** a work item has labels ["frontend", "api", "docs"]
- **THEN** the card footer SHALL display up to 3 label badges with a "+N" overflow indicator for additional labels

#### Scenario: Due date is displayed
- **WHEN** a work item has a due date set
- **THEN** a due date badge with calendar icon SHALL appear in the metadata footer

#### Scenario: Estimate is displayed
- **WHEN** a work item has an estimate value
- **THEN** an estimate badge SHALL appear in the metadata footer

#### Scenario: Assignee avatar is displayed
- **WHEN** a work item has an assignee
- **THEN** an avatar circle with the assignee's initial SHALL appear at the right edge of the metadata footer

#### Scenario: Blocked indicator is prominent
- **WHEN** a work item is marked as blocked
- **THEN** a destructive-styled blocked badge or indicator SHALL be clearly visible on the card

### Requirement: Card has visual elevation and hover effect

Each card SHALL have subtle visual elevation (shadow or border) and a hover state to indicate interactivity.

#### Scenario: Card at rest
- **WHEN** a card is rendered in the board column
- **THEN** it SHALL have a subtle border or shadow distinguishing it from the column background

#### Scenario: Card on hover
- **WHEN** a user hovers over a card
- **THEN** the card SHALL display an enhanced shadow or background change to indicate it is clickable

### Requirement: Card supports drag and drop

Cards in the board column view SHALL remain draggable for moving between columns.

#### Scenario: Dragging a card
- **WHEN** a user drags a card from one column
- **THEN** the card SHALL follow standard drag behavior and drop targets SHALL highlight as before
