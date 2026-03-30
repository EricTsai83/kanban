## MODIFIED Requirements

### Requirement: No hydration mismatch on theme icon
The theme toggle SHALL render safely during server-side rendering without causing a React hydration mismatch. The theme toggle button SHALL be visually correct in all theme modes, including when placed on a dark sidebar surface in light mode.

#### Scenario: Initial server render
- **WHEN** the page loads for the first time (before client hydration)
- **THEN** the toggle SHALL render a neutral placeholder icon until the client has mounted and `resolvedTheme` is available

#### Scenario: Light mode hover on dark sidebar
- **WHEN** the application is in light mode and the user hovers over the theme toggle button in the dark sidebar
- **THEN** the button background SHALL change to the sidebar hover color (`sidebar-muted`) and the icon SHALL remain visible (light-colored) against the dark background — the ghost variant's default hover styles MUST NOT override the sidebar-specific colors
