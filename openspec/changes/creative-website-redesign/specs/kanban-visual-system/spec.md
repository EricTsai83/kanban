## MODIFIED Requirements

### Requirement: Board uses a dark sidebar rail with a light content area
The system SHALL render a narrow sidebar on the left using a solid, flat dark color (no transparency, no blur, no gradient overlay). The sidebar background MUST be a single solid grayscale value that is visually distinct from but harmonious with the main content background. The sidebar MUST contain icon-based navigation and a settings entry point.

#### Scenario: Sidebar renders on board load
- **WHEN** a user loads the engineering kanban board
- **THEN** the system displays a solid-color dark sidebar rail on the left with icon links, and the board content fills the remaining viewport width with a flat background color

### Requirement: Typography and spacing follow a defined hierarchy
The system SHALL use a precise type scale: column headers at 11px uppercase with wide letter-spacing, item titles at 13px, metadata at 11px subdued. The border-radius SHALL be 6px maximum. Borders SHALL be near-invisible (3-6% opacity) or replaced by spacing. Visual hierarchy SHALL be achieved through grayscale levels and typography alone, not through borders or decorative effects.

#### Scenario: Visual hierarchy is readable at a glance
- **WHEN** a user scans the board
- **THEN** column names, item titles, and metadata are distinguishable by font size, weight, letter-spacing, and grayscale level alone — without relying on borders, shadows, or color accents
