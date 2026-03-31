## Why

The production frontend (`kanban-web-rosy.vercel.app`) cannot communicate with the FastAPI backend (`kanban-api-gamma.vercel.app`) because the backend is not returning the required CORS headers. This blocks all API calls in production, making the app non-functional for end users.

## What Changes

- Configure the FastAPI CORS middleware to explicitly allow the production frontend origin
- Ensure OPTIONS preflight requests receive correct `Access-Control-Allow-Origin` headers
- Support environment-based allowed origins so local dev and prod both work without hardcoding

## Capabilities

### New Capabilities

- `cors-config`: Backend CORS configuration that allows the production frontend origin and supports environment-based origin lists

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- `backend/main.py` (or equivalent FastAPI entry point): CORS middleware configuration
- Environment variables: add `ALLOWED_ORIGINS` or similar for Vercel deployment config
- No frontend changes required

## Non-goals

- Implementing authentication or request signing
- Adding rate limiting or other security middleware
- Changing any API routes or response shapes
