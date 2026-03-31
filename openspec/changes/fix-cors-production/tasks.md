## 1. Fix API Key Dependency

- [x] 1.1 Update `_verify_api_key` in `apps/api/main.py` to accept a `Request` parameter and skip the check when the method is OPTIONS

## 2. Add Vercel Routing Config

- [x] 2.1 Create `apps/api/vercel.json` with `@vercel/python` build targeting `main.py` and a catch-all route `/(.*)`

## 3. Verify

- [x] 3.1 Run `curl -X OPTIONS https://kanban-api-gamma.vercel.app/kanban -H "Origin: https://kanban-web-rosy.vercel.app" -H "Access-Control-Request-Method: GET" -v` after deploy and confirm `Access-Control-Allow-Origin` is present in the response
