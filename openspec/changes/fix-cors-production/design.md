## Context

The FastAPI backend is deployed to Vercel at `kanban-api-gamma.vercel.app`. The frontend at `kanban-web-rosy.vercel.app` is blocked by CORS because the backend does not return `Access-Control-Allow-Origin` on preflight (OPTIONS) responses in production.

Current state:
- `apps/api/main.py` has `CORSMiddleware` with `allow_origins=["*"]` — correct in isolation
- There is **no `vercel.json`** in `apps/api/` — Vercel does not know how to route requests to the ASGI app
- Without routing config, Vercel intercepts OPTIONS requests at the edge before they reach FastAPI, returning a bare 200 or 405 with no CORS headers
- The app-level `_verify_api_key` dependency would also reject preflight requests with 401 if they ever reached FastAPI, since browsers don't send `x-api-key` on OPTIONS

## Goals / Non-Goals

**Goals:**
- OPTIONS preflight requests reach FastAPI and receive correct CORS headers
- All API methods (GET, POST, PATCH, DELETE) work from the production frontend origin
- Local dev continues to work unchanged

**Non-Goals:**
- Changing authentication mechanism
- Restricting CORS to only the production origin (wildcard is acceptable; no credentials are used)
- Modifying the frontend

## Decisions

### Add `vercel.json` to `apps/api/`

Vercel Python serverless deployments require a `vercel.json` that:
1. Points the build at `main.py` using `@vercel/python`
2. Adds a catch-all route `"/(.*)"` → `main.py` so ALL HTTP methods including OPTIONS reach FastAPI

Without this, Vercel's edge layer handles routing and drops OPTIONS without CORS headers.

**Alternative considered**: Add an explicit OPTIONS route handler in FastAPI for every path. Rejected — fragile, duplicates middleware logic, and doesn't fix the root cause.

### Exclude OPTIONS from the `_verify_api_key` dependency

Even with correct routing, the app-level `_verify_api_key` dependency fires on every request. Starlette's `CORSMiddleware` handles OPTIONS before the ASGI app is called, but to be safe and explicit, the dependency should short-circuit on OPTIONS requests.

**Alternative considered**: Rely on Starlette middleware ordering alone. Accepted in theory but hard to reason about across Vercel's serverless adapter — being explicit is safer.

## Risks / Trade-offs

- `allow_origins=["*"]` is permissive but acceptable since the API is protected by an API key, not cookies/credentials
- Vercel's Python runtime (`@vercel/python`) has occasional cold-start latency — no change here

## Migration Plan

1. Add `apps/api/vercel.json`
2. Update `_verify_api_key` to skip check on OPTIONS
3. Redeploy `apps/api` to Vercel — no database migration, no frontend change needed
4. Verify preflight succeeds with `curl -X OPTIONS https://kanban-api-gamma.vercel.app/kanban -H "Origin: https://kanban-web-rosy.vercel.app" -H "Access-Control-Request-Method: GET" -v`
