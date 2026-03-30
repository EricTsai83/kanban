### Requirement: Theme toggle cycles between light and dark only
The theme toggle button SHALL cycle between exactly two states: light and dark. The system/auto theme option SHALL be removed.

#### Scenario: Toggle from light to dark
- **WHEN** the current theme is light and the user clicks the theme toggle button
- **THEN** the theme changes to dark and the button displays a Moon icon

#### Scenario: Toggle from dark to light
- **WHEN** the current theme is dark and the user clicks the theme toggle button
- **THEN** the theme changes to light and the button displays a Sun icon

### Requirement: Monitor icon is removed
The Monitor (system theme) icon SHALL NOT be imported or rendered. Only Sun and Moon icons SHALL be used for the theme toggle.

#### Scenario: Monitor icon not present in imports
- **WHEN** the component is compiled
- **THEN** the `Monitor` icon from lucide-react SHALL NOT be imported

### Requirement: Theme toggle has no tooltip
The theme toggle button SHALL NOT be wrapped in a Tooltip. The icon alone is sufficient to indicate the current theme.

#### Scenario: No tooltip on hover
- **WHEN** the user hovers over the theme toggle button
- **THEN** no tooltip is displayed
