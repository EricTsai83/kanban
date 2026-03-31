## 1. Monorepo Root Scaffolding

- [x] 1.1 Add `turbo` as a dev dependency to the root `package.json` and set `"packageManager": "pnpm@<version>"`
- [x] 1.2 Create `pnpm-workspace.yaml` declaring `apps/*` as workspace packages
- [x] 1.3 Create `turbo.json` with `dev` (persistent, no cache) and `build` tasks
- [x] 1.4 Update root `package.json` scripts: `dev` → `turbo dev`, `build` → `turbo build`

## 2. Move Next.js App to `apps/web`

- [x] 2.1 Create `apps/web/` directory
- [x] 2.2 Move `app/`, `components/`, `lib/`, `public/`, `data/` into `apps/web/`
- [x] 2.3 Move Next.js config files into `apps/web/`: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, `next-env.d.ts`
- [x] 2.4 Update `apps/web/package.json` name to `"web"` and add `"dev": "next dev"` and `"build": "next build"` scripts
- [x] 2.5 Verify `pnpm install` resolves all `apps/web` dependencies correctly

## 3. Create FastAPI App Skeleton (`apps/api`)

- [x] 3.1 Create `apps/api/` directory with `pyproject.toml` declaring `fastapi`, `uvicorn[standard]`, and `pydantic` dependencies
- [x] 3.2 Create `apps/api/package.json` shim with `"name": "api"` and `"scripts": { "dev": "uv run uvicorn main:app --reload --port 8000" }`
- [x] 3.3 Create `apps/api/data/` directory and copy `data/engineering-kanban-board.json` into it
- [x] 3.4 Create `apps/api/.env.example` documenting `ALLOWED_ORIGIN` and `DATA_DIR`

## 4. Port Data Models to Python (`models.py`)

- [x] 4.1 Create `apps/api/models.py` with Pydantic models for `KanbanColumn`, `KanbanWorkItem`, `KanbanBoard` matching the TypeScript types in `lib/kanban/types.ts`
- [x] 4.2 Add request body models: `CreateBoardRequest`, `CreateWorkItemRequest`, `UpdateWorkItemRequest`, `SaveColumnsRequest`

## 5. Port Persistence Layer (`store.py`)

- [x] 5.1 Create `apps/api/store.py` with `load_board()` and `write_board()` functions reading/writing `data/engineering-kanban-board.json`
- [x] 5.2 Port `createBoard`, `saveColumns`, `createWorkItem`, `updateWorkItem` logic from `lib/kanban/store.ts`
- [x] 5.3 Implement `KanbanStoreError` Python exception with a `status` code field

## 6. Port Validation Logic (`validation.py`)

- [x] 6.1 Create `apps/api/validation.py` porting `normalizeBoardName`, `normalizeColumnsInput`, `normalizeCreateWorkItemInput`, `normalizeUpdateWorkItemInput` from `lib/kanban/validation.ts`
- [x] 6.2 Ensure error messages match the TypeScript originals exactly (used by frontend i18n error mapping)

## 7. Wire FastAPI Routes (`main.py`)

- [x] 7.1 Create `apps/api/main.py` with FastAPI app instance and CORS middleware (allow `http://localhost:3000` and `ALLOWED_ORIGIN` env var)
- [x] 7.2 Implement `GET /kanban` and `POST /kanban` routes
- [x] 7.3 Implement `POST /kanban/items` and `PATCH /kanban/items` routes
- [x] 7.4 Implement `PATCH /kanban/columns` route
- [x] 7.5 Add global exception handler mapping `KanbanStoreError` → JSON error response with correct HTTP status

## 8. Update Frontend API Calls

- [x] 8.1 Add `apiUrl(path: string): string` helper to `apps/web/lib/` that prefixes `process.env.NEXT_PUBLIC_API_URL ?? ""`
- [x] 8.2 Create `apps/web/.env.local.example` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [x] 8.3 Update all `fetch("/api/kanban...")` calls in `components/kanban-app.tsx` to use `apiUrl("/kanban...")`
- [x] 8.4 Remove `app/api/` directory from `apps/web/` (Next.js route handlers no longer needed)

## 9. Verification

- [ ] 9.1 Run `pnpm dev` from repo root and confirm both apps start (Next.js on 3000, FastAPI on 8000)
- [ ] 9.2 Open browser at `http://localhost:3000` and verify board loads via FastAPI
- [ ] 9.3 Create a work item, update it, and confirm changes persist after API restart
- [ ] 9.4 Run `pnpm dev --filter web` and confirm only Next.js starts
- [ ] 9.5 Run `pnpm build --filter web` and confirm Turborepo caches the Next.js build on second run
