### Requirement: Toolbar view controls are visually grouped
The system SHALL render the view mode switcher and density/gantt switcher as a single visual group in the board header, separated from action buttons by a vertical divider.

#### Scenario: View controls appear together
- **WHEN** a user views the board header
- **THEN** the view mode switcher and density switcher SHALL be adjacent with no other controls between them, visually grouped away from the filter and new-item buttons

### Requirement: All icon-only toolbar buttons have tooltips
Every icon-only button in the board header toolbar SHALL display a tooltip on hover describing its action.

#### Scenario: Tooltip on icon button
- **WHEN** a user hovers over an icon-only button in the toolbar
- **THEN** a tooltip SHALL appear with the button's label (e.g., "Board", "List", "Compact", "Detailed", "Gantt")

### Requirement: Language switcher is accessible from settings
The language selection control SHALL be available inside the settings sheet, not in the top toolbar.

#### Scenario: Language switcher in settings sheet
- **WHEN** a user opens the settings sheet
- **THEN** the language selector SHALL be visible as the first item in the settings panel

#### Scenario: Language switcher absent from toolbar
- **WHEN** a user views the board header toolbar
- **THEN** no language selector SHALL appear in the toolbar

### Requirement: User avatar uses Shadcn Avatar component
The user avatar displayed in the sidebar SHALL use the Shadcn `Avatar` component with `AvatarFallback` showing the user's initials.

#### Scenario: Avatar shows initials fallback
- **WHEN** a logged-in user views the sidebar and no photo URL is available
- **THEN** the avatar SHALL render as a circle with the user's initials using `AvatarFallback`

#### Scenario: Avatar supports image slot
- **WHEN** a user object includes an avatar URL
- **THEN** the avatar SHALL render the image via `AvatarImage` with the initials fallback still in place for load errors
