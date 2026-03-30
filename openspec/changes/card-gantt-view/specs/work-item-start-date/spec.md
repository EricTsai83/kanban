## ADDED Requirements

### Requirement: Work item supports a start date field
The system SHALL allow users to set an optional start date on a work item in YYYY-MM-DD format.

#### Scenario: Create work item with start date
- **WHEN** a user creates a work item and provides a start date
- **THEN** the system stores the start date on the work item

#### Scenario: Create work item without start date
- **WHEN** a user creates a work item without providing a start date
- **THEN** the system stores the start date as null

### Requirement: Start date can be updated after creation
The system SHALL allow users to update the start date of an existing work item.

#### Scenario: Update start date via item editor
- **WHEN** a user edits a work item and changes the start date field
- **THEN** the system persists the updated start date

### Requirement: Start date validation
The system SHALL validate that the start date, when provided, uses the YYYY-MM-DD format.

#### Scenario: Invalid start date format rejected
- **WHEN** a user submits a work item with a start date that is not in YYYY-MM-DD format
- **THEN** the system rejects the request with a validation error

### Requirement: Start date is visible in the item editor
The system SHALL display the start date field in the work item editor form alongside the existing due date field.

#### Scenario: Start date field in editor
- **WHEN** a user opens the item editor dialog
- **THEN** the form displays a start date input field next to the due date field
