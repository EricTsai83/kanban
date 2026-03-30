## ADDED Requirements

### Requirement: User can switch between compact and detailed card display
The application SHALL provide a toggle control in the board header area allowing users to switch between "compact" and "detailed" display modes for work item rows. The default mode SHALL be "detailed".

#### Scenario: Toggle is visible in header
- **WHEN** the board is loaded and visible
- **THEN** a density toggle control SHALL be present in the header bar, showing the current mode

#### Scenario: Switching to compact mode
- **WHEN** the user selects compact mode via the toggle
- **THEN** all work item rows SHALL immediately update to show only the title, priority accent bar, priority badge, and assignee avatar — hiding all other metadata

#### Scenario: Switching to detailed mode
- **WHEN** the user selects detailed mode via the toggle
- **THEN** all work item rows SHALL display the full metadata row including assignee name, labels, estimate, due date, and blocked status

### Requirement: Compact mode hides the metadata row entirely
In compact mode, the second row of metadata (assignee name, labels, estimate, due date, blocked badge) SHALL NOT be rendered in the DOM, not merely hidden with CSS.

#### Scenario: Compact row has no metadata DOM
- **WHEN** a work item renders in compact mode
- **THEN** the metadata row element SHALL not exist in the DOM

#### Scenario: Compact row retains essential information
- **WHEN** a work item renders in compact mode
- **THEN** the row SHALL still display: priority color accent, title text, blocked icon (if applicable), priority badge, and assignee initial avatar
