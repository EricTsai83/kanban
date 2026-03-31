## ADDED Requirements

### Requirement: Board state is persisted to PostgreSQL
The system SHALL store kanban board, column, and work item data in a Neon PostgreSQL database using three tables: `kanban_boards`, `kanban_columns`, and `kanban_work_items`. The `DATABASE_URL` SHALL be loaded from `apps/api/.env`.

#### Scenario: Board survives API restart
- **WHEN** a work item is created and the FastAPI process is restarted
- **THEN** `GET /kanban` returns the board including the new item, loaded from PostgreSQL

#### Scenario: Missing DATABASE_URL causes startup failure
- **WHEN** the `DATABASE_URL` environment variable is not set and the API starts
- **THEN** the process raises a clear configuration error before accepting any requests

### Requirement: Schema is managed by Alembic migrations
The system SHALL use Alembic to version the database schema. The initial migration SHALL create all three tables and seed the board data from the existing JSON file if it is present.

#### Scenario: Fresh database is ready after upgrade
- **WHEN** `alembic upgrade head` is run against an empty database
- **THEN** all three tables exist and the board data from `data/engineering-kanban-board.json` is present

#### Scenario: Migration is idempotent on re-run
- **WHEN** `alembic upgrade head` is run a second time
- **THEN** no error is raised and no duplicate rows are inserted

### Requirement: All store operations are async
The system SHALL implement `load_board`, `create_board`, `save_columns`, `create_work_item`, and `update_work_item` as async functions accepting an `AsyncSession` parameter. No blocking I/O SHALL occur inside route handlers.

#### Scenario: Concurrent requests do not corrupt board state
- **WHEN** two `PATCH /kanban/items` requests arrive simultaneously for different items
- **THEN** both updates are applied correctly with no data loss

### Requirement: `labels` field is stored as a JSON array column
The system SHALL persist the `labels` list on work items as a native JSON/JSONB column in PostgreSQL, serialized and deserialized transparently by the ORM.

#### Scenario: Labels round-trip through the database
- **WHEN** a work item is created with `labels: ["backend", "api"]`
- **THEN** `GET /kanban` returns that item with `labels: ["backend", "api"]` in the same order
