## ADDED Requirements

### Requirement: All interactive transitions use 120-150ms duration
Every hover, focus, and state-change transition in the application SHALL complete within 120-150ms using `ease-out` timing. No transition SHALL exceed 150ms.

#### Scenario: Hover transition feels instantaneous
- **WHEN** user hovers over an interactive element
- **THEN** the visual change SHALL complete within 120-150ms, feeling near-instantaneous while remaining smooth

#### Scenario: No transitions use transform or box-shadow
- **WHEN** any hover or state transition occurs
- **THEN** the transition SHALL only affect `background-color`, `color`, `opacity`, or `border-color` — NEVER `transform`, `box-shadow`, or `filter`

### Requirement: Hover effects are background-color only
All hover effects on interactive elements (buttons, rows, links) SHALL be implemented as a subtle background-color change only. No element SHALL lift, scale, glow, or gain a shadow on hover.

#### Scenario: Work item row hover
- **WHEN** user hovers over a work item row
- **THEN** the row SHALL display a subtle background-color change (approximately `white` at 3-5% opacity in dark mode) with no vertical movement, shadow, or glow

#### Scenario: Sidebar button hover
- **WHEN** user hovers over a sidebar icon button
- **THEN** the button SHALL display a subtle background-color change with no scale, glow, or shadow effect

### Requirement: No decorative animations exist
The application SHALL NOT include any purely decorative animations such as fade-in on load, floating elements, pulsing effects, or ambient motion. Content SHALL appear immediately when data is available.

#### Scenario: Board content appears without animation
- **WHEN** the board finishes loading
- **THEN** the content SHALL appear immediately without fade-in, slide-in, or any entrance animation
