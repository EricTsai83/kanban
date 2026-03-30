## ADDED Requirements

### Requirement: Due date displays in human-readable format
The system SHALL render due dates on kanban cards and list view rows as compact, locale-aware labels rather than raw `YYYY-MM-DD` strings. The formatted label SHALL omit the year when the date falls within the current calendar year, and include it otherwise.

#### Scenario: Current-year date renders without year
- **WHEN** a work item's due date is within the current calendar year
- **THEN** the card and list row display the date as a short month-day label (e.g. "Apr 15" in English, "4月15日" in Traditional Chinese)

#### Scenario: Past-year date renders with year
- **WHEN** a work item's due date falls in a prior calendar year
- **THEN** the card and list row display the date including the year (e.g. "Apr 15, 2025")

### Requirement: Relative labels for today, tomorrow, and yesterday
The system SHALL replace the formatted date label with a locale-appropriate relative word when the due date is today, tomorrow, or yesterday relative to the user's local calendar date.

#### Scenario: Due date is today
- **WHEN** a work item's due date equals the current local calendar date
- **THEN** the displayed label is "Today" (English) or "今天" (Traditional Chinese)

#### Scenario: Due date is tomorrow
- **WHEN** a work item's due date equals the next local calendar date
- **THEN** the displayed label is "Tomorrow" (English) or "明天" (Traditional Chinese)

#### Scenario: Due date is yesterday
- **WHEN** a work item's due date equals the previous local calendar date
- **THEN** the displayed label is "Yesterday" (English) or "昨天" (Traditional Chinese)

### Requirement: Overdue and near-due dates are visually distinguished
The system SHALL apply distinct color styling to due date badges and text to communicate urgency without relying solely on the date label.

#### Scenario: Overdue date styling
- **WHEN** a work item's due date is strictly before today
- **THEN** the due date badge and text SHALL use destructive (red) color tokens

#### Scenario: Due today styling
- **WHEN** a work item's due date equals today
- **THEN** the due date badge and text SHALL use amber color tokens

#### Scenario: Due within three days styling
- **WHEN** a work item's due date is 1, 2, or 3 days from today (excluding today itself)
- **THEN** the due date badge and text SHALL use yellow color tokens

#### Scenario: Future date beyond three days
- **WHEN** a work item's due date is more than 3 days away
- **THEN** the due date badge and text use the default secondary style (no urgency color)
