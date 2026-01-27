"""add_authentication_tables

Revision ID: 20251216_auth
Revises: 20251214_inbox_messages
Create Date: 2024-12-16

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20251216_auth'
down_revision = 'inbox_messages_001'  # Fixed: use correct revision ID
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_verified', sa.Boolean(), nullable=True, default=False),
        sa.Column('onboarding_complete', sa.Boolean(), nullable=True, default=False),
        sa.Column('onboarding_step', sa.String(), nullable=True),
        sa.Column('agent_email', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('postal_code', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('wants_energy', sa.Boolean(), nullable=True, default=False),
        sa.Column('wants_mobile', sa.Boolean(), nullable=True, default=False),
        sa.Column('wants_internet', sa.Boolean(), nullable=True, default=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('agent_email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create magic_links table
    op.create_table(
        'magic_links',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('token_hash', sa.String(), nullable=False),
        sa.Column('used', sa.Boolean(), nullable=True, default=False),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_magic_links_token_hash'), 'magic_links', ['token_hash'], unique=False)
    op.create_index(op.f('ix_magic_links_user_id'), 'magic_links', ['user_id'], unique=False)
    op.create_index(op.f('ix_magic_links_expires_at'), 'magic_links', ['expires_at'], unique=False)

    # Create sessions table
    op.create_table(
        'sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('token', sa.String(), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=True, default=False),
        sa.Column('revoked_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('last_activity_at', sa.DateTime(), nullable=True),
        sa.Column('user_agent', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token')
    )
    op.create_index(op.f('ix_sessions_token'), 'sessions', ['token'], unique=True)
    op.create_index(op.f('ix_sessions_user_id'), 'sessions', ['user_id'], unique=False)
    op.create_index(op.f('ix_sessions_expires_at'), 'sessions', ['expires_at'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_sessions_expires_at'), table_name='sessions')
    op.drop_index(op.f('ix_sessions_user_id'), table_name='sessions')
    op.drop_index(op.f('ix_sessions_token'), table_name='sessions')
    op.drop_table('sessions')
    
    op.drop_index(op.f('ix_magic_links_expires_at'), table_name='magic_links')
    op.drop_index(op.f('ix_magic_links_user_id'), table_name='magic_links')
    op.drop_index(op.f('ix_magic_links_token_hash'), table_name='magic_links')
    op.drop_table('magic_links')
    
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')




