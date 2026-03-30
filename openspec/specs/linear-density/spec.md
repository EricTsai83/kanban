## ADDED Requirements

### Requirement: Typography uses precise size and weight hierarchy
The application SHALL use a precise typographic hierarchy: column headers at 11px uppercase with wide letter-spacing (0.05-0.08em), work item titles at 13px normal weight, metadata at 11px with reduced opacity. Font weights SHALL be limited to normal (400) and medium (500) only.

#### Scenario: Column header typography
- **WHEN** a board column header renders
- **THEN** the text SHALL be 11px, uppercase, font-weight medium (500), with letter-spacing of 0.05-0.08em, and colored as muted-foreground

#### Scenario: Work item title typography
- **WHEN** a work item title renders in a row
- **THEN** the text SHALL be 13px, font-weight normal (400), with default letter-spacing

#### Scenario: Metadata typography
- **WHEN** metadata (assignee, labels, dates) renders
- **THEN** the text SHALL be 11px with reduced opacity (50-60% of foreground color)

### Requirement: Element spacing follows a consistent 4px grid
All spacing between elements (padding, margin, gaps) SHALL follow a 4px base grid. Common values: 4px, 8px, 12px, 16px, 20px, 24px. No arbitrary spacing values SHALL be used.

#### Scenario: Work item row internal spacing
- **WHEN** a work item row renders
- **THEN** all internal padding and gaps between elements SHALL be multiples of 4px

### Requirement: Border-radius uses small consistent values
The global border-radius SHALL be 6px (0.375rem) maximum. All derived radius values SHALL scale proportionally from this base.

#### Scenario: UI elements have small rounded corners
- **WHEN** any bordered or elevated UI element renders (cards, badges, inputs, buttons)
- **THEN** the border-radius SHALL not exceed 6px, creating a precise, tool-like appearance rather than a soft, consumer-app appearance

### Requirement: Borders are near-invisible or replaced by spacing
Visible borders between UI sections SHALL be extremely subtle (3-6% opacity) or replaced entirely by spacing. Column separators SHALL use spacing rather than visible border lines.

#### Scenario: Column separation in workflow view
- **WHEN** the board displays in workflow view with multiple columns
- **THEN** columns SHALL be visually separated by spacing and/or subtle background differentiation rather than visible border lines

#### Scenario: Header separator is subtle
- **WHEN** the header bar renders above the board content
- **THEN** the bottom separator SHALL be a border at no more than 6% opacity
