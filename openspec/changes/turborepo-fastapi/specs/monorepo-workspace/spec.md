## ADDED Requirements

### Requirement: Project is organised as a Turborepo monorepo
The system SHALL be structured as a Turborepo monorepo with `apps/web` (Next.js) and `apps/api` (Python FastAPI) as the two application packages.

#### Scenario: Single dev command starts all apps
- **WHEN** a developer runs `pnpm dev` at the repo root
- **THEN** Turborepo starts both `apps/web` (Next.js on port 3000) and `apps/api` (FastAPI on port 8000) concurrently

#### Scenario: Workspace is discovered by pnpm
- **WHEN** a developer runs `pnpm install` at the repo root
- **THEN** pnpm installs dependencies for all JS packages declared in `pnpm-workspace.yaml`

### Requirement: Each app can be developed and built independently
The system SHALL allow each app to be run or built in isolation without requiring the other app to be running.

#### Scenario: Run only the frontend
- **WHEN** a developer runs `pnpm dev --filter web`
- **THEN** only `apps/web` starts; no Python process is launched

#### Scenario: Run only the backend
- **WHEN** a developer runs `pnpm dev --filter api`
- **THEN** only `apps/api` starts; no Next.js process is launched

### Requirement: Turborepo caches build outputs
The system SHALL use Turborepo task caching for the `build` task so that unchanged packages are not rebuilt.

#### Scenario: Cached build skips unchanged app
- **WHEN** a developer runs `pnpm build` and `apps/web` has not changed since the last build
- **THEN** Turborepo reports the `build` task for `apps/web` as cached and skips re-execution
