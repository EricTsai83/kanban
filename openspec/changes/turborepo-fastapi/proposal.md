## Why

The current project is a single Next.js app where API logic lives inside Next.js route handlers backed by local filesystem storage — which is not Vercel-deployable and couples frontend and backend into one process. Migrating to a Turborepo monorepo with a dedicated Python FastAPI backend decouples the two concerns, enables independent deployment, and prepares the stack for a production-grade persistence layer.

## What Changes

- **BREAKING** Restructure repo root into a Turborepo monorepo: `apps/web` (Next.js) and `apps/api` (Python FastAPI)
- **BREAKING** Remove all Next.js API route handlers (`app/api/kanban/**`); the frontend will call the FastAPI service instead
- Add `turbo.json`, root `package.json` workspace config, and `pnpm-workspace.yaml`
- Create a new Python FastAPI app with Pydantic models, business logic, and JSON-file persistence (migrated from `lib/kanban/store.ts`)
- Update Next.js frontend fetch base URL to point to FastAPI (`http://localhost:8000` in dev, configurable via env var)
- Port `lib/kanban/validation.ts` validation rules to Pydantic models in the Python backend

## Capabilities

### New Capabilities

- `monorepo-workspace`: Turborepo workspace config — `turbo.json`, root scripts, `apps/` structure, dev orchestration
- `fastapi-kanban-api`: Python FastAPI service exposing the same HTTP contract as the removed Next.js routes (`GET/POST /kanban`, `POST/PATCH /kanban/items`, `PATCH /kanban/columns`), with Pydantic validation and JSON-file persistence

### Modified Capabilities

- `engineering-kanban-board`: API base URL is now configurable via `NEXT_PUBLIC_API_URL` env var; no functional requirement changes

## Impact

- Entire `app/api/` directory removed
- `lib/kanban/store.ts`, `lib/kanban/validation.ts` logic migrated to Python; TypeScript types remain for the frontend
- New `apps/` directory structure; existing Next.js code moves to `apps/web/`
- New `apps/api/` Python project (`pyproject.toml` / `uv`, FastAPI, Pydantic, Uvicorn)
- `data/engineering-kanban-board.json` remains the persistence file, path now relative to `apps/api/`
- Dev requires running both `next dev` and `uvicorn` concurrently (orchestrated via Turborepo)

## Non-goals

- Replacing JSON-file persistence with a database
- Adding authentication changes beyond what already exists
- CI/CD pipeline configuration
- Docker / containerisation
