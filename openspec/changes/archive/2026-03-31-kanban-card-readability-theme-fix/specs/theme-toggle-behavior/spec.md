## ADDED Requirements

### Requirement: Theme icon reflects the resolved visual theme

The theme toggle button icon SHALL reflect the actually rendered theme (resolved), not the user's preference string.

#### Scenario: System preference is dark mode

- **WHEN** the user's theme preference is "system" and the OS is in dark mode
- **THEN** the toggle icon SHALL display a Moon icon (not a Monitor icon)

#### Scenario: Explicit light mode selected

- **WHEN** the user's theme preference is "light"
- **THEN** the toggle icon SHALL display a Sun icon

#### Scenario: Explicit dark mode selected

- **WHEN** the user's theme preference is "dark"
- **THEN** the toggle icon SHALL display a Moon icon

### Requirement: Theme tooltip shows preference and resolved state

The tooltip on the theme toggle button SHALL show both the user's preference and the resolved theme when they differ.

#### Scenario: System mode resolves to light

- **WHEN** theme preference is "system" and the resolved theme is "light"
- **THEN** the tooltip SHALL display "System (light)"

#### Scenario: System mode resolves to dark

- **WHEN** theme preference is "system" and the resolved theme is "dark"
- **THEN** the tooltip SHALL display "System (dark)"

#### Scenario: Explicit mode selected

- **WHEN** theme preference is "light" or "dark" (not "system")
- **THEN** the tooltip SHALL display the capitalized preference name (e.g., "Light" or "Dark")

### Requirement: Theme cycling always produces a visible change

The theme toggle SHALL cycle in an order that ensures each click produces a visible UI change or a meaningful state transition.

#### Scenario: Cycling from system when OS is light

- **WHEN** the current theme is "system" (resolved: light) and the user clicks the toggle
- **THEN** the theme SHALL change to "dark", producing a visible change

#### Scenario: Full cycle order

- **WHEN** the user clicks the theme toggle repeatedly
- **THEN** the theme SHALL cycle through: light → dark → system → light

### Requirement: No hydration mismatch on theme icon

The theme toggle SHALL render safely during server-side rendering without causing a React hydration mismatch.

#### Scenario: Initial server render

- **WHEN** the page loads for the first time (before client hydration)
- **THEN** the toggle SHALL render a neutral placeholder icon until the client has mounted and `resolvedTheme` is available
