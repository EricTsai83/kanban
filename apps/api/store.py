from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from models import KanbanBoard, KanbanColumn, KanbanWorkItem
from orm import BoardRow, ColumnRow, WorkItemRow
from validation import (
    normalize_board_name,
    normalize_columns_input,
    normalize_create_work_item_input,
    normalize_update_work_item_input,
)

DEFAULT_COLUMN_NAMES = [
    "Backlog",
    "Ready",
    "In Progress",
    "In Review",
    "Blocked",
    "Testing",
    "Done",
]


class KanbanStoreError(Exception):
    def __init__(self, message: str, status: int = 400):
        super().__init__(message)
        self.status = status


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _row_to_column(row: ColumnRow) -> KanbanColumn:
    return KanbanColumn(id=row.id, name=row.name, order=row.order)


def _row_to_item(row: WorkItemRow) -> KanbanWorkItem:
    return KanbanWorkItem(
        id=row.id,
        columnId=row.column_id,
        title=row.title,
        description=row.description,
        assignee=row.assignee,
        priority=row.priority,
        labels=row.labels or [],
        estimate=row.estimate,
        startDate=row.start_date,
        dueDate=row.due_date,
        isBlocked=row.is_blocked,
        coverImage=row.cover_image,
        order=row.order,
        createdAt=row.created_at,
        updatedAt=row.updated_at,
    )


async def _assemble_board(board_row: BoardRow, db: AsyncSession) -> KanbanBoard:
    cols_result = await db.execute(
        select(ColumnRow)
        .where(ColumnRow.board_id == board_row.id)
        .order_by(ColumnRow.order)
    )
    items_result = await db.execute(
        select(WorkItemRow)
        .where(WorkItemRow.board_id == board_row.id)
        .order_by(WorkItemRow.order)
    )
    return KanbanBoard(
        id=board_row.id,
        name=board_row.name,
        createdAt=board_row.created_at,
        updatedAt=board_row.updated_at,
        columns=[_row_to_column(r) for r in cols_result.scalars().all()],
        items=[_row_to_item(r) for r in items_result.scalars().all()],
    )


async def load_board(db: AsyncSession) -> Optional[KanbanBoard]:
    result = await db.execute(select(BoardRow).limit(1))
    board_row = result.scalars().first()
    if board_row is None:
        return None
    return await _assemble_board(board_row, db)


async def _require_board(db: AsyncSession) -> KanbanBoard:
    board = await load_board(db)
    if board is None:
        raise KanbanStoreError("Create a board before updating it.", 404)
    return board


async def create_board(name_input: object, db: AsyncSession) -> KanbanBoard:
    existing = await load_board(db)
    if existing:
        raise KanbanStoreError("A board already exists.", 409)

    now = _now()
    board_id = str(uuid.uuid4())
    db.add(BoardRow(id=board_id, name=normalize_board_name(name_input), created_at=now, updated_at=now))

    for index, col_name in enumerate(DEFAULT_COLUMN_NAMES):
        db.add(ColumnRow(id=str(uuid.uuid4()), board_id=board_id, name=col_name, order=index))

    await db.flush()

    result = await db.execute(select(BoardRow).where(BoardRow.id == board_id))
    return await _assemble_board(result.scalars().one(), db)


async def save_columns(columns_input: object, db: AsyncSession) -> KanbanBoard:
    board = await _require_board(db)

    if isinstance(columns_input, list):
        raw = [c.model_dump() if hasattr(c, "model_dump") else c for c in columns_input]
    else:
        raw = columns_input

    normalized = normalize_columns_input(raw)
    next_column_ids = {
        col["id"] if col["id"] else str(uuid.uuid4())
        for col in normalized
    }

    orphaned = [item for item in board.items if item.columnId not in next_column_ids]
    if orphaned:
        raise KanbanStoreError("Move all work items out of a column before removing it.", 409)

    await db.execute(delete(ColumnRow).where(ColumnRow.board_id == board.id))

    for index, col in enumerate(normalized):
        col_id = col["id"] if col["id"] else str(uuid.uuid4())
        db.add(ColumnRow(id=col_id, board_id=board.id, name=col["name"], order=index))

    now = _now()
    board_result = await db.execute(select(BoardRow).where(BoardRow.id == board.id))
    board_row = board_result.scalars().one()
    board_row.updated_at = now

    await db.flush()
    return await _assemble_board(board_row, db)


async def create_work_item(payload: object, db: AsyncSession) -> KanbanBoard:
    board = await _require_board(db)

    raw = payload.model_dump() if hasattr(payload, "model_dump") else payload
    normalized = normalize_create_work_item_input(raw, board)
    now = _now()

    column_items = [i for i in board.items if i.columnId == normalized["columnId"]]
    next_order = (max(i.order for i in column_items) + 1) if column_items else 0

    db.add(WorkItemRow(
        id=str(uuid.uuid4()),
        board_id=board.id,
        column_id=normalized["columnId"],
        title=normalized["title"],
        description=normalized.get("description") or "",
        assignee=normalized.get("assignee") or "",
        priority=normalized.get("priority") or "medium",
        labels=normalized.get("labels") or [],
        estimate=normalized.get("estimate"),
        start_date=normalized.get("startDate"),
        due_date=normalized.get("dueDate"),
        is_blocked=normalized.get("isBlocked") or False,
        cover_image=normalized.get("coverImage"),
        order=next_order,
        created_at=now,
        updated_at=now,
    ))

    board_result = await db.execute(select(BoardRow).where(BoardRow.id == board.id))
    board_row = board_result.scalars().one()
    board_row.updated_at = now

    await db.flush()
    return await _assemble_board(board_row, db)


async def delete_work_item(item_id: str, db: AsyncSession) -> KanbanBoard:
    board = await _require_board(db)

    item_result = await db.execute(
        select(WorkItemRow).where(WorkItemRow.id == item_id)
    )
    item_row = item_result.scalars().first()
    if item_row is None:
        raise KanbanStoreError("Work item not found.", 404)

    await db.execute(delete(WorkItemRow).where(WorkItemRow.id == item_id))

    now = _now()
    board_result = await db.execute(select(BoardRow).where(BoardRow.id == board.id))
    board_row = board_result.scalars().one()
    board_row.updated_at = now

    await db.flush()
    return await _assemble_board(board_row, db)


async def update_work_item(payload: object, db: AsyncSession) -> KanbanBoard:
    board = await _require_board(db)

    raw = payload.model_dump() if hasattr(payload, "model_dump") else payload
    normalized = normalize_update_work_item_input(raw, board)

    item_result = await db.execute(
        select(WorkItemRow).where(WorkItemRow.id == normalized["id"])
    )
    item_row = item_result.scalars().first()
    if item_row is None:
        raise KanbanStoreError("Work item not found.", 404)

    next_column_id = normalized.get("columnId", item_row.column_id)
    moved = next_column_id != item_row.column_id
    if moved:
        other_items = [i for i in board.items if i.id != item_row.id and i.columnId == next_column_id]
        next_order = (max(i.order for i in other_items) + 1) if other_items else 0
    else:
        next_order = item_row.order

    for field, col in [
        ("title", "title"),
        ("description", "description"),
        ("assignee", "assignee"),
        ("priority", "priority"),
        ("labels", "labels"),
        ("estimate", "estimate"),
        ("startDate", "start_date"),
        ("dueDate", "due_date"),
        ("isBlocked", "is_blocked"),
        ("coverImage", "cover_image"),
    ]:
        if field in normalized:
            setattr(item_row, col, normalized[field])

    item_row.column_id = next_column_id
    item_row.order = next_order
    item_row.updated_at = _now()

    board_result = await db.execute(select(BoardRow).where(BoardRow.id == board.id))
    board_row = board_result.scalars().one()
    board_row.updated_at = _now()

    await db.flush()
    return await _assemble_board(board_row, db)
