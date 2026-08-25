"""Align house 3 catalog data with the forest house model.

House id 3 is an existing inventory item. Keep its id and internal slug so
historical booking requests and availability links remain valid.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE houses
            SET name = :name,
                capacity = :capacity,
                short_description = :short_description
            WHERE id = :house_id AND slug = :slug
            """
        ).bindparams(
            name="Домик в лесу 34м²",
            capacity=4,
            short_description="Уютный домик в лесу с верандой и видом на горы.",
            house_id=3,
            slug="compact-32",
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            """
            UPDATE houses
            SET name = :name,
                capacity = :capacity,
                short_description = :short_description
            WHERE id = :house_id AND slug = :slug
            """
        ).bindparams(
            name="Компактный домик 32м²",
            capacity=3,
            short_description="Уютный домик для двоих-троих с видом на лес и горы.",
            house_id=3,
            slug="compact-32",
        )
    )
