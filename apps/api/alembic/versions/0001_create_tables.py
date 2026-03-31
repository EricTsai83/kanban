"""create_tables

Revision ID: 0001
Revises:
Create Date: 2026-03-31

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Create tables ──────────────────────────────────────────────────────────

    op.create_table(
        "kanban_boards",
        sa.Column("id", sa.String(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("created_at", sa.String(), nullable=False),
        sa.Column("updated_at", sa.String(), nullable=False),
    )

    op.create_table(
        "kanban_columns",
        sa.Column("id", sa.String(), primary_key=True, nullable=False),
        sa.Column("board_id", sa.String(), sa.ForeignKey("kanban_boards.id"), nullable=False),
        sa.Column("name", sa.String(40), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
    )

    op.create_table(
        "kanban_work_items",
        sa.Column("id", sa.String(), primary_key=True, nullable=False),
        sa.Column("board_id", sa.String(), sa.ForeignKey("kanban_boards.id"), nullable=False),
        sa.Column("column_id", sa.String(), sa.ForeignKey("kanban_columns.id"), nullable=False),
        sa.Column("title", sa.String(120), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("assignee", sa.String(80), nullable=False, server_default=""),
        sa.Column("priority", sa.String(16), nullable=False, server_default="medium"),
        sa.Column("labels", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("estimate", sa.Float(), nullable=True),
        sa.Column("start_date", sa.String(), nullable=True),
        sa.Column("due_date", sa.String(), nullable=True),
        sa.Column("is_blocked", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("cover_image", sa.Text(), nullable=True),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.String(), nullable=False),
        sa.Column("updated_at", sa.String(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("kanban_work_items")
    op.drop_table("kanban_columns")
    op.drop_table("kanban_boards")
