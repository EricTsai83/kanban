## 1. Add Python Dependencies

- [x] 1.1 Add `asyncpg`, `sqlalchemy[asyncio]`, `alembic`, and `python-dotenv` to `apps/api/pyproject.toml`
- [x] 1.2 Install deps: `pip install asyncpg sqlalchemy[asyncio] alembic python-dotenv` (or `uv sync`)

## 2. Database Engine & Session (`database.py`)

- [x] 2.1 Create `apps/api/database.py` that calls `load_dotenv()` and reads `DATABASE_URL` from env (raise `RuntimeError` if missing)
- [x] 2.2 Create `create_async_engine` with `pool_pre_ping=True` and an `async_sessionmaker`
- [x] 2.3 Implement `get_db()` async generator dependency that yields `AsyncSession` within a transaction

## 3. ORM Models (`orm.py`)

- [x] 3.1 Create `apps/api/orm.py` with `DeclarativeBase` subclass `Base`
- [x] 3.2 Define `BoardRow` mapped class: `id`, `name`, `created_at`, `updated_at`
- [x] 3.3 Define `ColumnRow` mapped class: `id`, `board_id` (FK → boards), `name`, `order`
- [x] 3.4 Define `WorkItemRow` mapped class: all fields from `KanbanWorkItem` — use `JSON` type for `labels`

## 4. Alembic Setup

- [x] 4.1 Run `alembic init alembic` inside `apps/api/`
- [x] 4.2 Edit `apps/api/alembic/env.py`: import `Base` from `orm`, set `target_metadata = Base.metadata`, load `DATABASE_URL` from env
- [x] 4.3 Edit `apps/api/alembic.ini`: set `sqlalchemy.url` to a placeholder (actual URL comes from env in `env.py`)

## 5. Initial Migration (create tables + seed)

- [x] 5.1 Create migration file `apps/api/alembic/versions/0001_create_tables.py`
- [x] 5.2 In `upgrade()`: create `kanban_boards`, `kanban_columns`, `kanban_work_items` tables with correct columns and foreign keys
- [x] 5.3 In `upgrade()`: if `apps/api/data/engineering-kanban-board.json` exists, read it and insert rows using `op.bulk_insert()` — skip if board ID already present
- [x] 5.4 In `downgrade()`: drop all three tables in reverse dependency order
- [x] 5.5 Run `alembic upgrade head` and verify tables exist and data is seeded

## 6. Rewrite Store (`store.py`)

- [x] 6.1 Rewrite `load_board(db: AsyncSession) -> KanbanBoard | None` using SQLAlchemy `select` statements
- [x] 6.2 Rewrite `create_board(name_input, db: AsyncSession) -> KanbanBoard` — insert board + default columns
- [x] 6.3 Rewrite `save_columns(columns_input, db: AsyncSession) -> KanbanBoard` — delete/insert columns, reject orphaned items
- [x] 6.4 Rewrite `create_work_item(payload, db: AsyncSession) -> KanbanBoard` — insert item, return full board
- [x] 6.5 Rewrite `update_work_item(payload, db: AsyncSession) -> KanbanBoard` — update item fields, handle column move

## 7. Update Routes (`main.py`)

- [x] 7.1 Change all five route handlers from `def` to `async def`
- [x] 7.2 Add `db: AsyncSession = Depends(get_db)` parameter to each route handler
- [x] 7.3 Pass `db` to each store function call
- [x] 7.4 Add FastAPI `lifespan` context manager to dispose the engine on shutdown

## 8. Verification

- [x] 8.1 Start API with `python3 -m uvicorn main:app --reload --port 8000` and confirm startup with no errors
- [x] 8.2 `GET /kanban` returns the seeded board from PostgreSQL
- [x] 8.3 `POST /kanban/items` creates an item and it persists after API restart
- [x] 8.4 `PATCH /kanban/items` updates an item correctly
- [x] 8.5 `PATCH /kanban/columns` saves column changes and rejects orphaned-item removal with 409
