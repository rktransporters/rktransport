"""Remove supplemental service data."""

from typing import Sequence, Union

from alembic import op


revision: str = "011"
down_revision: Union[str, Sequence[str], None] = "010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("bookings", "storage_end_date")
    op.drop_column("bookings", "storage_start_date")
    op.drop_constraint("bookings_storage_plan_id_fkey", "bookings", type_="foreignkey")
    op.drop_column("bookings", "storage_plan_id")
    op.drop_column("site_settings", "phone_recovery")
    op.drop_table("storage_plans")
