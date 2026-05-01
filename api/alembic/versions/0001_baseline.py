"""baseline schema — houses + booking_requests (with S10 forward columns) + admin_audit_logs

Revision ID: 0001
Revises:
Create Date: 2026-05-01
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    existing = set(inspector.get_table_names())

    if "houses" not in existing:
        op.create_table(
            "houses",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("name", sa.String(120), nullable=False),
            sa.Column("slug", sa.String(120), unique=True, nullable=False),
            sa.Column("capacity", sa.Integer(), nullable=False, server_default="2"),
            sa.Column("base_price", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("short_description", sa.String(300), nullable=False, server_default=""),
            sa.Column("created_at", sa.DateTime(), nullable=True),
        )

    if "booking_requests" not in existing:
        op.create_table(
            "booking_requests",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("house_id", sa.Integer(), sa.ForeignKey("houses.id"), nullable=True),
            sa.Column("guest_name", sa.String(120), nullable=False),
            sa.Column("guest_phone", sa.String(32), nullable=False, index=True),
            sa.Column("guest_comment", sa.Text(), nullable=False, server_default=""),
            sa.Column("check_in", sa.Date(), nullable=False),
            sa.Column("check_out", sa.Date(), nullable=False),
            sa.Column("guests_count", sa.Integer(), nullable=False, server_default="2"),
            sa.Column("status", sa.String(32), nullable=False, server_default="new"),
            sa.Column("source", sa.String(32), nullable=False, server_default="website"),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("forwarded_at", sa.DateTime(), nullable=True),
            sa.Column("forwarded_status", sa.String(32), nullable=True),
            sa.Column("easycamp_booking_id", sa.Integer(), nullable=True, index=True),
            sa.Column("forward_error", sa.Text(), nullable=True),
        )

    if "admin_audit_logs" not in existing:
        op.create_table(
            "admin_audit_logs",
            sa.Column("id", sa.Integer(), primary_key=True, index=True),
            sa.Column("entity", sa.String(64), nullable=False),
            sa.Column("entity_id", sa.Integer(), nullable=True),
            sa.Column("action", sa.String(64), nullable=False),
            sa.Column("payload", sa.Text(), nullable=False, server_default=""),
            sa.Column("created_at", sa.DateTime(), nullable=True),
        )


def downgrade() -> None:
    op.drop_table("admin_audit_logs")
    op.drop_table("booking_requests")
    op.drop_table("houses")
