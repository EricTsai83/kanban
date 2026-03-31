## Context

Current state: a single Next.js 16 app where `app/api/kanban/**` route handlers call `lib/kanban/store.ts` which reads/writes a local JSON file. Everything runs in one process (`next dev`). There are three HTTP endpoints:

| Method | Path | Action |
|---|---|---|
| GET | /api/kanban | Load board |
| POST | /api/kanban | Create board |
| POST | /api/kanban/items | Create work item |
| PATCH | /api/kanban/items | Update work item |
| PATCH | /api/kanban/columns | Save columns |

Target state: Turborepo monorepo with two apps (`apps/web`, `apps/api`) that run as separate processes in dev and deploy independently.

## Goals / Non-Goals

**Goals:**
- Move Next.js app to `apps/web/` with minimal code changes
- Create `apps/api/` Python FastAPI service with identical HTTP contract
- Wire Turborepo `dev` pipeline to start both concurrently
- Frontend calls FastAPI via `NEXT_PUBLIC_API_URL` env var

**Non-Goals:**
- Changing persistence (stays JSON file)
- Shared TypeScript package / `packages/` layer (single frontend consumer, not worth the overhead)
- Docker, CI/CD, deployment configuration

## Decisions

### 1. Package manager: pnpm workspaces

`pnpm-workspace.yaml` declaring `apps/*`. Turborepo is installed at the root. The Python app is not a JS package — it sits in `apps/api/` but is not listed in `workspaces`; Turborepo runs it via a custom `dev` script that calls `uvicorn`.

**Alternatives considered:** npm workspaces — no advantage here; yarn — team isn't using it.

### 2. Python tooling: `uv` + `pyproject.toml`

`uv` for fast dependency management. Dependencies: `fastapi`, `uvicorn[standard]`, `pydantic`. No virtual-env activation required in scripts — `uv run uvicorn ...` handles it.

**Alternatives considered:** `poetry` — heavier; plain `pip + requirements.txt` — no lockfile ergonomics.

### 3. FastAPI project layout

```
apps/api/
├── pyproject.toml
├── main.py          # FastAPI app, route registration
├── models.py        # Pydantic request/response models (port of lib/kanban/types.ts)
├── store.py         # Board persistence (port of lib/kanban/store.ts)
├── validation.py    # Input normalization (port of lib/kanban/validation.ts)
└── data/            # JSON file lives here (copied from project root data/)
```

Single-file-per-concern mirrors the existing TypeScript structure, making the port auditable side-by-side.

### 4. CORS

FastAPI mounts `CORSMiddleware` allowing `http://localhost:3000` (Next.js dev origin) and the value of `ALLOWED_ORIGIN` env var for production.

### 5. Frontend API base URL

`kanban-app.tsx` currently calls `/api/kanban`. All fetch calls will be updated to use a helper `apiUrl(path)` that prefixes `process.env.NEXT_PUBLIC_API_URL ?? ""`. In dev `NEXT_PUBLIC_API_URL=http://localhost:8000`; in a same-origin deployment it can be empty.

**Alternatives considered:** Next.js rewrites proxy (`/api/kanban` → FastAPI) — avoids env var but adds latency and another hop; rejected for simplicity.

### 6. Turborepo pipeline

```json
{
  "tasks": {
    "dev": { "cache": false, "persistent": true }
  }
}
```

Root `package.json` scripts:
- `dev` → `turbo dev` (starts both `apps/web` and `apps/api` concurrently)
- `build` → `turbo build` (Next.js only; Python has no build step)

`apps/api/package.json` is a minimal shim so Turborepo can discover and run the Python dev server:
```json
{ "name": "api", "scripts": { "dev": "uv run uvicorn main:app --reload --port 8000" } }
```

## Risks / Trade-offs

- **Port conflicts in dev** → `apps/web` on 3000, `apps/api` on 8000; documented in root README; configurable via env var.
- **Data file location change** → `data/engineering-kanban-board.json` moves to `apps/api/data/`. Any existing local data must be copied manually. → Migration note in tasks.
- **CORS misconfiguration in production** → `ALLOWED_ORIGIN` must be set. → Documented in `apps/api/.env.example`.
- **Python not in JS workspace** → `turbo` discovers `apps/api` only via the shim `package.json`. If `uv` is not installed, `dev` fails with a clear error message.

## Migration Plan

1. Create monorepo scaffolding at repo root (turbo, pnpm workspace)
2. Move `app/`, `components/`, `lib/`, `public/`, config files → `apps/web/`
3. Create `apps/api/` with FastAPI, port store + validation logic
4. Update frontend fetch calls
5. Remove `app/api/` from `apps/web/`
6. Copy `data/` to `apps/api/data/`
7. Smoke-test: `pnpm dev` starts both, board loads in browser

**Rollback:** All changes are in-repo. `git revert` returns to the single-app state.

## Open Questions

- Should `apps/api/data/` be git-ignored (treated as runtime state) or committed (as seed data)? Current behaviour commits the JSON — keep that for now.
