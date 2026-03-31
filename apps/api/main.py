from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database import engine, get_db
from models import (
    BoardResponse,
    CreateBoardRequest,
    CreateWorkItemRequest,
    DeleteWorkItemRequest,
    SaveColumnsRequest,
    UpdateWorkItemRequest,
)
from store import KanbanStoreError, create_board, create_work_item, delete_work_item, load_board, save_columns, update_work_item

# ── Lifespan ───────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


# ── App ────────────────────────────────────────────────────────────────────────

app = FastAPI(title="Kanban API", lifespan=lifespan)

# ── CORS ───────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API Key ────────────────────────────────────────────────────────────────────

_api_key = os.environ.get("API_KEY", "").strip()

@app.middleware("http")
async def api_key_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    if _api_key and request.headers.get("X-API-Key") != _api_key:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    return await call_next(request)

# ── Exception handlers ─────────────────────────────────────────────────────────

@app.exception_handler(KanbanStoreError)
async def kanban_store_error_handler(request: Request, exc: KanbanStoreError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status,
        content={"error": str(exc)},
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"error": str(exc)},
    )

# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/kanban", response_model=BoardResponse)
async def get_board(db: AsyncSession = Depends(get_db)) -> Any:
    board = await load_board(db)
    return {"board": board}


@app.post("/kanban", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
async def post_board(body: CreateBoardRequest, db: AsyncSession = Depends(get_db)) -> Any:
    board = await create_board(body.name, db)
    return {"board": board}


@app.post("/kanban/items", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
async def post_item(body: CreateWorkItemRequest, db: AsyncSession = Depends(get_db)) -> Any:
    board = await create_work_item(body.model_dump(exclude_unset=False), db)
    return {"board": board}


@app.patch("/kanban/items", response_model=BoardResponse)
async def patch_item(body: UpdateWorkItemRequest, db: AsyncSession = Depends(get_db)) -> Any:
    board = await update_work_item(body.model_dump(exclude_unset=True), db)
    return {"board": board}


@app.delete("/kanban/items/{item_id}", response_model=BoardResponse)
async def delete_item(item_id: str, db: AsyncSession = Depends(get_db)) -> Any:
    board = await delete_work_item(item_id, db)
    return {"board": board}


@app.patch("/kanban/columns", response_model=BoardResponse)
async def patch_columns(body: SaveColumnsRequest, db: AsyncSession = Depends(get_db)) -> Any:
    board = await save_columns(body.columns or [], db)
    return {"board": board}
