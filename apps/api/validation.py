"""
Port of lib/kanban/validation.ts — error messages must match exactly
so the frontend i18n error-mapping table continues to work.
"""
from __future__ import annotations

import re
from typing import Any, Optional

from models import KanbanBoard, KanbanPriority

# ── Constants (mirrors lib/kanban/constants.ts) ────────────────────────────────

KANBAN_PRIORITIES: list[str] = ["low", "medium", "high", "urgent"]
MAX_BOARD_NAME_LENGTH = 80
MAX_COLUMN_NAME_LENGTH = 40
MAX_WORK_ITEM_TITLE_LENGTH = 120
MAX_WORK_ITEM_DESCRIPTION_LENGTH = 2000
MAX_ASSIGNEE_LENGTH = 80
MAX_LABEL_LENGTH = 24
MAX_LABEL_COUNT = 8
MAX_ESTIMATE_POINTS = 40

DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


# ── Private helpers ────────────────────────────────────────────────────────────

def _normalize_text(
    value: Any,
    field: str,
    max_length: int,
    *,
    required: bool = True,
) -> str:
    if value is None:
        if required:
            raise ValueError(f"{field} is required.")
        return ""

    if not isinstance(value, str):
        raise ValueError(f"{field} must be a string.")

    normalized = value.strip()

    if required and len(normalized) == 0:
        raise ValueError(f"{field} is required.")

    if len(normalized) > max_length:
        raise ValueError(f"{field} must be {max_length} characters or fewer.")

    return normalized


def _normalize_priority(value: Any) -> KanbanPriority:
    if not isinstance(value, str) or value not in KANBAN_PRIORITIES:
        raise ValueError("priority must be one of low, medium, high, or urgent.")
    return value  # type: ignore[return-value]


def _normalize_estimate(value: Any) -> Optional[float]:
    if value is None or value == "":
        return None

    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise ValueError("estimate must be a number.")

    if value != int(value) or int(value) < 0 or int(value) > MAX_ESTIMATE_POINTS:
        raise ValueError(
            f"estimate must be an integer between 0 and {MAX_ESTIMATE_POINTS}."
        )

    return float(value)


def _normalize_date(value: Any, field: str) -> Optional[str]:
    if value is None or value == "":
        return None

    if not isinstance(value, str):
        raise ValueError(f"{field} must be a string.")

    if not DATE_RE.match(value):
        raise ValueError(f"{field} must use YYYY-MM-DD format.")

    return value


def _normalize_cover_image(value: Any) -> Optional[str]:
    if value is None or value == "":
        return None

    if not isinstance(value, str):
        raise ValueError("coverImage must be a string.")

    return value.strip()


def _normalize_labels(value: Any) -> list[str]:
    if value is None:
        return []

    if not isinstance(value, list):
        raise ValueError("labels must be an array of strings.")

    normalized = [
        _normalize_text(label, "label", MAX_LABEL_LENGTH)
        for label in value
    ]
    normalized = [l for l in normalized if l]
    deduped = list(dict.fromkeys(normalized))

    if len(deduped) > MAX_LABEL_COUNT:
        raise ValueError(f"labels must contain {MAX_LABEL_COUNT} items or fewer.")

    return deduped


# ── Public API ─────────────────────────────────────────────────────────────────

def normalize_board_name(value: Any) -> str:
    return _normalize_text(value, "Board name", MAX_BOARD_NAME_LENGTH)


def normalize_column_name(value: Any) -> str:
    return _normalize_text(value, "Column name", MAX_COLUMN_NAME_LENGTH)


def normalize_columns_input(value: Any) -> list[dict]:
    if not isinstance(value, list) or len(value) == 0:
        raise ValueError("columns must contain at least one column.")

    seen_ids: set[str] = set()
    seen_names: set[str] = set()
    result = []

    for index, column in enumerate(value):
        if not isinstance(column, dict):
            raise ValueError(f"Column {index + 1} is invalid.")

        normalized_name = normalize_column_name(column.get("name"))
        raw_id = column.get("id")
        normalized_id: Optional[str] = None

        if isinstance(raw_id, str) and raw_id.strip():
            normalized_id = raw_id.strip()

        if normalized_id:
            if normalized_id in seen_ids:
                raise ValueError("column ids must be unique.")
            seen_ids.add(normalized_id)

        name_key = normalized_name.lower()
        if name_key in seen_names:
            raise ValueError("column names must be unique.")
        seen_names.add(name_key)

        result.append({"id": normalized_id, "name": normalized_name})

    return result


def normalize_create_work_item_input(value: Any, board: KanbanBoard) -> dict:
    if not isinstance(value, dict):
        raise ValueError("Work item payload is invalid.")

    column_id = _normalize_text(value.get("columnId"), "columnId", 100)
    valid_column_ids = {col.id for col in board.columns}

    if column_id not in valid_column_ids:
        raise ValueError("columnId must reference an existing board column.")

    return {
        "title": _normalize_text(value.get("title"), "title", MAX_WORK_ITEM_TITLE_LENGTH),
        "description": _normalize_text(
            value.get("description"), "description", MAX_WORK_ITEM_DESCRIPTION_LENGTH, required=False
        ),
        "assignee": _normalize_text(
            value.get("assignee"), "assignee", MAX_ASSIGNEE_LENGTH, required=False
        ),
        "priority": _normalize_priority(value["priority"]) if "priority" in value and value["priority"] is not None else "medium",
        "labels": _normalize_labels(value.get("labels")),
        "estimate": _normalize_estimate(value.get("estimate")),
        "startDate": _normalize_date(value.get("startDate"), "startDate"),
        "dueDate": _normalize_date(value.get("dueDate"), "dueDate"),
        "isBlocked": bool(value.get("isBlocked")) if isinstance(value.get("isBlocked"), bool) else False,
        "coverImage": _normalize_cover_image(value.get("coverImage")),
        "columnId": column_id,
    }


def normalize_update_work_item_input(value: Any, board: KanbanBoard) -> dict:
    if not isinstance(value, dict):
        raise ValueError("Work item payload is invalid.")

    item_id = _normalize_text(value.get("id"), "id", 100)
    valid_column_ids = {col.id for col in board.columns}
    result: dict = {"id": item_id}

    if "title" in value:
        result["title"] = _normalize_text(value["title"], "title", MAX_WORK_ITEM_TITLE_LENGTH)

    if "description" in value:
        result["description"] = _normalize_text(
            value["description"], "description", MAX_WORK_ITEM_DESCRIPTION_LENGTH, required=False
        )

    if "assignee" in value:
        result["assignee"] = _normalize_text(
            value["assignee"], "assignee", MAX_ASSIGNEE_LENGTH, required=False
        )

    if "priority" in value:
        result["priority"] = _normalize_priority(value["priority"])

    if "labels" in value:
        result["labels"] = _normalize_labels(value["labels"])

    if "estimate" in value:
        result["estimate"] = _normalize_estimate(value["estimate"])

    if "startDate" in value:
        result["startDate"] = _normalize_date(value["startDate"], "startDate")

    if "dueDate" in value:
        result["dueDate"] = _normalize_date(value["dueDate"], "dueDate")

    if "isBlocked" in value:
        if not isinstance(value["isBlocked"], bool):
            raise ValueError("isBlocked must be a boolean.")
        result["isBlocked"] = value["isBlocked"]

    if "coverImage" in value:
        result["coverImage"] = _normalize_cover_image(value["coverImage"])

    if "columnId" in value:
        column_id = _normalize_text(value["columnId"], "columnId", 100)
        if column_id not in valid_column_ids:
            raise ValueError("columnId must reference an existing board column.")
        result["columnId"] = column_id

    return result


def validate_stored_board(value: Any) -> dict:
    if not isinstance(value, dict):
        raise ValueError("Stored board is invalid.")

    if not isinstance(value.get("columns"), list) or not isinstance(value.get("items"), list):
        raise ValueError("Stored board is missing columns or items.")

    return value
