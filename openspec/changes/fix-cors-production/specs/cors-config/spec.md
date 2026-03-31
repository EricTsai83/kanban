## ADDED Requirements

### Requirement: Vercel routing configuration
The API deployment SHALL include a `vercel.json` at `apps/api/vercel.json` that routes all HTTP methods (including OPTIONS) to the FastAPI ASGI app via the `@vercel/python` builder.

#### Scenario: OPTIONS preflight reaches FastAPI
- **WHEN** a browser sends an OPTIONS request to any API endpoint
- **THEN** the request SHALL be forwarded to the FastAPI app and receive an `Access-Control-Allow-Origin` header in the response

#### Scenario: Other methods still route correctly
- **WHEN** a browser sends GET, POST, PATCH, or DELETE to an API endpoint
- **THEN** the request SHALL be forwarded to the FastAPI app and processed normally

### Requirement: API key check skips OPTIONS preflight
The `_verify_api_key` dependency SHALL not return 401 for OPTIONS preflight requests, since browsers do not include custom headers on preflight.

#### Scenario: Preflight bypasses API key check
- **WHEN** an OPTIONS request arrives without an `x-api-key` header
- **THEN** the dependency SHALL allow the request to proceed without raising HTTP 401

#### Scenario: Non-OPTIONS requests still enforced
- **WHEN** a GET, POST, PATCH, or DELETE request arrives without a valid `x-api-key` header
- **AND** an `API_KEY` environment variable is set
- **THEN** the dependency SHALL raise HTTP 401 Unauthorized
