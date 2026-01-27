"""Add password_hash to admin_users

Revision ID: admin_password_hash
Revises: f92f33dbcf80
Create Date: 2024-12-11 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'admin_password_hash'
down_revision = 'f92f33dbcf80'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add password_hash column to admin_users
    op.add_column('admin_users', sa.Column('password_hash', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('admin_users', 'password_hash')





