from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel

KanbanPriority = Literal["low", "medium", "high", "urgent"]


# ── Domain models ──────────────────────────────────────────────────────────────

class KanbanColumn(BaseModel):
    id: str
    name: str
    order: int


class KanbanWorkItem(BaseModel):
    id: str
    title: str
    description: str
    assignee: str
    priority: KanbanPriority
    labels: list[str]
    estimate: Optional[float] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    isBlocked: bool
    coverImage: Optional[str] = None
    columnId: str
    order: int
    createdAt: str
    updatedAt: str


class KanbanBoard(BaseModel):
    id: str
    name: str
    createdAt: str
    updatedAt: str
    columns: list[KanbanColumn]
    items: list[KanbanWorkItem]


# ── Request bodies ─────────────────────────────────────────────────────────────

class CreateBoardRequest(BaseModel):
    name: Optional[str] = None


class ColumnInput(BaseModel):
    id: Optional[str] = None
    name: str


class SaveColumnsRequest(BaseModel):
    columns: Optional[list[ColumnInput]] = None


class CreateWorkItemRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee: Optional[str] = None
    priority: Optional[str] = None
    labels: Optional[list] = None
    estimate: Optional[float] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    isBlocked: Optional[bool] = None
    coverImage: Optional[str] = None
    columnId: Optional[str] = None


class UpdateWorkItemRequest(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    assignee: Optional[str] = None
    priority: Optional[str] = None
    labels: Optional[list] = None
    estimate: Optional[float] = None
    startDate: Optional[str] = None
    dueDate: Optional[str] = None
    isBlocked: Optional[bool] = None
    coverImage: Optional[str] = None
    columnId: Optional[str] = None


class DeleteWorkItemRequest(BaseModel):
    item_id: Optional[str] = None


# ── Report ────────────────────────────────────────────────────────────────────

DateField = Literal["createdAt", "updatedAt", "dueDate", "startDate"]


class ReportGroup(BaseModel):
    column: str
    items: list[KanbanWorkItem]


class ReportSummary(BaseModel):
    total: int
    byPriority: dict[str, int]
    byColumn: dict[str, int]


class ReportResponse(BaseModel):
    items: list[ReportGroup]
    summary: ReportSummary


# ── Response ───────────────────────────────────────────────────────────────────

class BoardResponse(BaseModel):
    board: Optional[KanbanBoard] = None
