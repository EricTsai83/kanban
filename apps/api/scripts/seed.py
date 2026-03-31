"""Seed the database with demo data from data/seed-demo-board.json.

Usage (from apps/api/):
    python3 scripts/seed.py

Skips silently if the board already exists.
"""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

from sqlalchemy import select, text

from database import engine
from orm import BoardRow, ColumnRow, WorkItemRow

_DATA_FILE = Path(__file__).parent.parent / "data" / "seed-demo-board.json"


async def seed() -> None:
    if not _DATA_FILE.exists():
        print(f"Seed file not found: {_DATA_FILE}")
        sys.exit(1)

    data = json.loads(_DATA_FILE.read_text(encoding="utf-8"))
    board_id = data["id"]

    async with engine.begin() as conn:
        existing = await conn.execute(
            select(BoardRow.id).where(BoardRow.id == board_id)
        )
        if existing.fetchone():
            print(f"Board '{data['name']}' already exists — skipping.")
            return

        await conn.execute(
            BoardRow.__table__.insert(),
            {"id": board_id, "name": data["name"], "created_at": data["createdAt"], "updated_at": data["updatedAt"]},
        )

        for col in data["columns"]:
            await conn.execute(
                ColumnRow.__table__.insert(),
                {"id": col["id"], "board_id": board_id, "name": col["name"], "order": col["order"]},
            )

        for item in data["items"]:
            await conn.execute(
                WorkItemRow.__table__.insert(),
                {
                    "id": item["id"],
                    "board_id": board_id,
                    "column_id": item["columnId"],
                    "title": item["title"],
                    "description": item.get("description", ""),
                    "assignee": item.get("assignee", ""),
                    "priority": item.get("priority", "medium"),
                    "labels": item.get("labels", []),
                    "estimate": item.get("estimate"),
                    "start_date": item.get("startDate"),
                    "due_date": item.get("dueDate"),
                    "is_blocked": item.get("isBlocked", False),
                    "cover_image": item.get("coverImage"),
                    "order": item["order"],
                    "created_at": item["createdAt"],
                    "updated_at": item["updatedAt"],
                },
            )

    print(f"Seeded board '{data['name']}' with {len(data['columns'])} columns and {len(data['items'])} items.")


asyncio.run(seed())
