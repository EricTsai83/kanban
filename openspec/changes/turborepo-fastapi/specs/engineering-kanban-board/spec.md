## MODIFIED Requirements

### Requirement: Engineering team can create a kanban board
The system SHALL allow an engineering team to create a kanban board with a board name and a default workflow appropriate for software delivery. The board is created via `POST /kanban` on the FastAPI service.

#### Scenario: Create board with default engineering workflow
- **WHEN** a user creates a new engineering kanban board
- **THEN** the system creates a board with ordered columns for backlog, ready, in progress, in review, blocked, testing, and done

### Requirement: Board workflow columns can be configured
The system SHALL allow authorized users to add, rename, reorder, and remove workflow columns on an engineering kanban board. Column changes are persisted via `PATCH /kanban/columns` on the FastAPI service.

#### Scenario: Reorder workflow columns
- **WHEN** an authorized user changes the order of columns on a board
- **THEN** the system persists the new column order and renders future board loads in that order

#### Scenario: Remove an empty workflow column
- **WHEN** an authorized user removes a workflow column that has no work items
- **THEN** the system removes the column from the board configuration

### Requirement: Board configuration must preserve work tracking integrity
The system MUST prevent board configuration changes that would leave work items without a valid workflow column.

#### Scenario: Reject removal of non-empty column
- **WHEN** an authorized user attempts to remove a column that still contains work items
- **THEN** the system rejects the change and explains that items must be moved first

### Requirement: Frontend board API calls are routed to the FastAPI service
The Next.js frontend SHALL route all kanban API calls to the URL specified by the `NEXT_PUBLIC_API_URL` environment variable (defaulting to an empty string for same-origin deployments). In local development, this MUST be set to `http://localhost:8000`.

#### Scenario: Frontend uses configured API base URL
- **WHEN** `NEXT_PUBLIC_API_URL` is set to `http://localhost:8000`
- **THEN** all kanban fetch calls from the frontend are sent to `http://localhost:8000/kanban` (and sub-paths)

#### Scenario: Frontend falls back to same-origin when env var is unset
- **WHEN** `NEXT_PUBLIC_API_URL` is not set
- **THEN** kanban fetch calls use a relative URL (same-origin), compatible with a reverse-proxy deployment
