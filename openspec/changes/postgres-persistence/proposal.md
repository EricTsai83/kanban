## Why

The FastAPI backend currently persists the kanban board to a single local JSON file, which cannot scale, is not safe for concurrent requests, and is not deployable to any cloud platform. A Neon PostgreSQL database is already provisioned and its `DATABASE_URL` is available in `apps/api/.env`, making this the right moment to replace the file-based store with a real database.

## What Changes

- **BREAKING** Remove JSON-file persistence (`apps/api/store.py` file I/O, `apps/api/data/` directory)
- Add `asyncpg`, `SQLAlchemy[asyncio]`, and `alembic` to `apps/api/pyproject.toml`
- Introduce SQLAlchemy async ORM models for `kanban_board`, `kanban_column`, and `kanban_work_item` tables
- Replace synchronous `store.py` functions with async equivalents backed by PostgreSQL
- Add Alembic migration that creates the three tables and seeds the initial board from the existing JSON file
- Make FastAPI routes fully async (`async def`) and inject a database session via dependency
- Load `DATABASE_URL` from `apps/api/.env` using `python-dotenv`

## Capabilities

### New Capabilities

- `postgres-kanban-store`: Async PostgreSQL persistence for kanban board, columns, and work items using SQLAlchemy async + asyncpg, replacing the JSON file store

### Modified Capabilities

- `fastapi-kanban-api`: Routes become fully async; board state now comes from PostgreSQL; behaviour and HTTP contract are unchanged

## Impact

- `apps/api/store.py` — rewritten with async SQLAlchemy session
- `apps/api/models.py` — ORM models added alongside Pydantic response models
- `apps/api/main.py` — routes changed to `async def`, DB session injected
- `apps/api/pyproject.toml` — new deps: `asyncpg`, `sqlalchemy[asyncio]`, `alembic`, `python-dotenv`
- New `apps/api/alembic/` directory with initial migration
- `apps/api/data/` — no longer used at runtime (kept as reference copy)

## Non-goals

- Multi-tenancy or per-user boards
- Connection pooling beyond SQLAlchemy's built-in async pool
- Read replicas or any other Neon-specific features beyond the standard `DATABASE_URL`
- Any changes to the HTTP API contract or frontend code
