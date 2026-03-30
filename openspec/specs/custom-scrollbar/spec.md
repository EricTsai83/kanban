### Requirement: Scrollbars use thin custom styling
All scrollbars in the application SHALL be styled to 3-4px width with colors that match the application's design system. The scrollbar thumb SHALL use a subtle foreground color at reduced opacity.

#### Scenario: Vertical scrollbar in board columns
- **WHEN** a board column has more items than visible space and the user scrolls
- **THEN** the scrollbar SHALL appear as a 3-4px thin track with a rounded thumb matching the muted foreground color

#### Scenario: Horizontal scrollbar on the board
- **WHEN** the board has more columns than the viewport width
- **THEN** the horizontal scrollbar SHALL use the same thin 3-4px styling

### Requirement: Scrollbar visibility is subtle
The scrollbar thumb SHALL be semi-transparent in its idle state and become slightly more visible on hover, blending with the overall design rather than drawing attention.

#### Scenario: Scrollbar at idle
- **WHEN** the scrollable area is not being actively scrolled or hovered
- **THEN** the scrollbar thumb SHALL display at reduced opacity (approximately 20-30%)

#### Scenario: Scrollbar on hover
- **WHEN** the user hovers over a scrollable area or the scrollbar itself
- **THEN** the scrollbar thumb opacity SHALL increase (approximately 40-50%) for better visibility

### Requirement: Scrollbar styling works across browsers
The scrollbar styling SHALL work in WebKit/Blink browsers (Chrome, Safari, Edge) via `::-webkit-scrollbar` pseudo-elements and provide a reasonable fallback for Firefox using `scrollbar-width: thin` and `scrollbar-color`.

#### Scenario: Firefox displays thin scrollbar
- **WHEN** the application loads in Firefox
- **THEN** scrollbars SHALL render with `scrollbar-width: thin` and appropriate `scrollbar-color` values
