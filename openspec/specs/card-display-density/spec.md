### Requirement: User can switch between compact and detailed card display
The application SHALL provide a toggle control in the board header area allowing users to switch between "compact" and "detailed" display modes for work item cards. The default mode SHALL be "detailed".

#### Scenario: Toggle is visible in header
- **WHEN** the board is loaded and visible
- **THEN** a density toggle control SHALL be present in the header bar, showing the current mode

#### Scenario: Switching to compact mode
- **WHEN** the user selects compact mode via the toggle
- **THEN** all work item cards SHALL immediately update to hide cover images, description snippets, and metadata footer — showing only the title, priority accent bar, priority badge, and assignee avatar in a single compact row

#### Scenario: Switching to detailed mode
- **WHEN** the user selects detailed mode via the toggle
- **THEN** all work item cards SHALL display the full card layout including cover image (if present), title, description snippet, and metadata footer with labels, estimate, due date, and assignee

### Requirement: Compact mode hides cover image and description
In compact mode, the cover image area and description snippet SHALL NOT be rendered in the DOM. The card SHALL collapse to a single-row layout similar to the previous `WorkItemRow` design.

#### Scenario: Compact card has no cover image DOM
- **WHEN** a work item with a cover image renders in compact mode
- **THEN** the cover image element SHALL not exist in the DOM

#### Scenario: Compact card has no description DOM
- **WHEN** a work item with a description renders in compact mode
- **THEN** the description snippet element SHALL not exist in the DOM

#### Scenario: Compact card retains essential information
- **WHEN** a work item renders in compact mode
- **THEN** the card SHALL still display: priority color accent, title text, blocked icon (if applicable), priority badge, and assignee initial avatar
