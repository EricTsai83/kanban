## Context

Current state: `apps/api/store.py` reads and writes a single JSON file (`apps/api/data/engineering-kanban-board.json`). All functions are synchronous. FastAPI routes call them directly with `def` (not `async def`).

Target: replace with async SQLAlchemy ORM backed by the Neon PostgreSQL instance whose `DATABASE_URL` is in `apps/api/.env`. Schema: three tables — `kanban_boards`, `kanban_columns`, `kanban_work_items` — mirroring the existing Pydantic/TypeScript types.

## Goals / Non-Goals

**Goals:**
- Async end-to-end: engine → session → route handlers
- Schema managed by Alembic; first migration creates tables and seeds data from existing JSON
- `DATABASE_URL` loaded from `.env` via `python-dotenv`; no hardcoded credentials
- HTTP contract and Pydantic response models unchanged — zero frontend impact

**Non-Goals:**
- ORM relationships/lazy-loading (queries stay explicit)
- Any connection pool tuning beyond SQLAlchemy defaults
- Alembic auto-generate from here on (one migration is enough for this change)

## Decisions

### 1. SQLAlchemy async core with ORM mapped classes

`create_async_engine` + `AsyncSession` + `async_sessionmaker`. ORM mapped classes (`MappedBase`) give us type-safe column access without raw SQL strings.

**Alternatives considered:** `databases` library (lighter, but less mature typing); raw `asyncpg` (more control, but reimplements too much of what SQLAlchemy already provides).

### 2. One async engine, session-per-request via FastAPI dependency

A single module-level `engine` is created at startup. `get_db()` is an async generator dependency that yields an `AsyncSession` and commits/rolls back on exit.

```python
async def get_db():
    async with AsyncSession(engine) as session:
        async with session.begin():
            yield session
```

**Alternatives considered:** `lifespan` context manager for engine teardown — added for clean shutdown.

### 3. Alembic for schema management

One initial migration: `create_tables` — creates all three tables. A second step in the migration's `upgrade()` function reads the existing JSON file (if present) and inserts rows, preserving all IDs and timestamps.

**Alternatives considered:** `Base.metadata.create_all()` at startup — non-reversible, no history.

### 4. Table design

```
kanban_boards       id PK, name, created_at, updated_at
kanban_columns      id PK, board_id FK, name, order
kanban_work_items   id PK, board_id FK, column_id FK, title, description,
                    assignee, priority, labels (JSONB), estimate,
                    start_date, due_date, is_blocked, cover_image,
                    order, created_at, updated_at
```

`labels` stored as `JSONB` (native array in Postgres, no join table needed for this use-case).

### 5. `python-dotenv` for env loading

`load_dotenv()` called at the top of `database.py`. In production the env vars are injected by the platform; `dotenv` is a no-op when they're already set.

## Risks / Trade-offs

- **Neon cold-start latency** → first connection after idle period is ~500 ms; acceptable for a dev POC. Mitigation: `pool_pre_ping=True` on the engine.
- **Alembic seed is one-time** → if the JSON file is later updated and migrations re-run, the seed data won't be re-applied. → Document this clearly.
- **Concurrent writes** → `AsyncSession` with `session.begin()` gives row-level locking within a request; concurrent requests may still race on `order` fields. Acceptable for a single-board POC.

## Migration Plan

1. Add Python deps (`asyncpg`, `sqlalchemy[asyncio]`, `alembic`, `python-dotenv`)
2. Create `apps/api/database.py` — engine + session factory
3. Create `apps/api/orm.py` — SQLAlchemy ORM mapped classes
4. `alembic init alembic` inside `apps/api/`, configure `env.py`
5. Write migration `0001_create_tables.py` (create + seed from JSON)
6. `alembic upgrade head` to apply
7. Rewrite `store.py` as async functions using `AsyncSession`
8. Update `main.py` routes to `async def` + `Depends(get_db)`
9. Smoke-test all five endpoints

**Rollback:** `alembic downgrade base` drops all three tables; restore `store.py` from git.
