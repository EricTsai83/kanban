## ADDED Requirements

### Requirement: FastAPI service exposes the kanban board HTTP contract
The system SHALL provide a Python FastAPI service at `apps/api/` that exposes the same HTTP endpoints previously served by Next.js API routes, preserving the existing request/response contract exactly.

#### Scenario: Load board
- **WHEN** a client sends `GET /kanban`
- **THEN** the service returns `{ "board": <KanbanBoard> }` with status 200, or `{ "board": null }` if no board exists

#### Scenario: Create board
- **WHEN** a client sends `POST /kanban` with `{ "name": "<string>" }`
- **THEN** the service creates a board with default engineering columns and returns `{ "board": <KanbanBoard> }` with status 201

#### Scenario: Create work item
- **WHEN** a client sends `POST /kanban/items` with a valid work item payload
- **THEN** the service appends the item and returns the updated board with status 201

#### Scenario: Update work item
- **WHEN** a client sends `PATCH /kanban/items` with a valid update payload including item `id`
- **THEN** the service updates the item and returns the updated board with status 200

#### Scenario: Save columns
- **WHEN** a client sends `PATCH /kanban/columns` with a valid columns array
- **THEN** the service persists the new column configuration and returns the updated board with status 200

### Requirement: FastAPI service validates input with Pydantic and returns structured errors
The system SHALL use Pydantic models to validate all incoming request bodies and return 400-level error responses with an `{ "error": "<message>" }` body for invalid input, preserving the same error messages as the TypeScript validation.

#### Scenario: Invalid work item payload returns 400
- **WHEN** a client sends `POST /kanban/items` with a missing required field (e.g., no `title`)
- **THEN** the service returns status 400 with `{ "error": "<field> is required." }`

#### Scenario: Duplicate board creation returns 409
- **WHEN** a client sends `POST /kanban` and a board already exists
- **THEN** the service returns status 409 with `{ "error": "A board already exists." }`

#### Scenario: Removing a non-empty column returns 409
- **WHEN** a client sends `PATCH /kanban/columns` with a column list that omits a column containing work items
- **THEN** the service returns status 409 with `{ "error": "Move all work items out of a column before removing it." }`

### Requirement: FastAPI service allows cross-origin requests from the Next.js frontend
The system SHALL mount CORS middleware permitting requests from the Next.js dev origin (`http://localhost:3000`) and from the origin specified by the `ALLOWED_ORIGIN` environment variable.

#### Scenario: CORS preflight from frontend is accepted
- **WHEN** the browser sends a preflight `OPTIONS` request from `http://localhost:3000`
- **THEN** the service responds with the appropriate CORS headers allowing the origin

### Requirement: FastAPI service persists board state to a local JSON file
The system SHALL read and write board state from `apps/api/data/engineering-kanban-board.json`, creating the file and directory on first write.

#### Scenario: Board persists across service restarts
- **WHEN** a work item is created and the API process is restarted
- **THEN** the board including the new item is returned on the next `GET /kanban`
