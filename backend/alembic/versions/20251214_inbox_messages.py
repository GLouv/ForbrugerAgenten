"""Add messages and notification_preferences tables

Revision ID: inbox_messages_001
Revises: uploaded_files_table
Create Date: 2025-12-14

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'inbox_messages_001'
down_revision = 'admin_password_hash'  # Fixed: point to admin migration
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', sa.String(), nullable=False, index=True),
        sa.Column('provider_id', sa.String(), sa.ForeignKey('providers.id'), nullable=True),
        sa.Column('provider_name', sa.String(), nullable=True),
        sa.Column('subject', sa.String(500), nullable=False),
        sa.Column('body', sa.Text(), nullable=False),
        sa.Column('body_html', sa.Text(), nullable=True),
        sa.Column('message_type', sa.String(50), default='info'),
        sa.Column('direction', sa.String(50), default='inbound'),
        sa.Column('status', sa.String(50), default='unread'),
        sa.Column('quote_request_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('case_id', sa.String(), nullable=True),
        sa.Column('original_email_id', sa.String(), nullable=True),
        sa.Column('from_email', sa.String(), nullable=True),
        sa.Column('to_email', sa.String(), nullable=True),
        sa.Column('attachments', postgresql.JSON(), default=list),
        sa.Column('parsed_data', postgresql.JSON(), nullable=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.Column('received_at', sa.DateTime(), server_default=sa.text('NOW()')),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()')),
    )
    
    # Add indexes
    op.create_index('idx_messages_user_id', 'messages', ['user_id'])
    op.create_index('idx_messages_provider_id', 'messages', ['provider_id'])
    op.create_index('idx_messages_status', 'messages', ['status'])
    op.create_index('idx_messages_message_type', 'messages', ['message_type'])
    op.create_index('idx_messages_received_at', 'messages', ['received_at'])
    
    # Create notification_preferences table
    op.create_table(
        'notification_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', sa.String(), unique=True, nullable=False, index=True),
        
        # Email preferences
        sa.Column('email_quotes', sa.Boolean(), default=True),
        sa.Column('email_marketing', sa.Boolean(), default=False),
        sa.Column('email_system', sa.Boolean(), default=True),
        sa.Column('email_reminders', sa.Boolean(), default=True),
        sa.Column('email_newsletter', sa.Boolean(), default=False),
        
        # Inbox preferences
        sa.Column('inbox_quotes', sa.Boolean(), default=True),
        sa.Column('inbox_marketing', sa.Boolean(), default=False),
        sa.Column('inbox_system', sa.Boolean(), default=True),
        
        # Push preferences
        sa.Column('push_quotes', sa.Boolean(), default=True),
        sa.Column('push_marketing', sa.Boolean(), default=False),
        sa.Column('push_reminders', sa.Boolean(), default=True),
        sa.Column('push_price_alerts', sa.Boolean(), default=True),
        
        # Provider permissions
        sa.Column('allow_provider_contact', sa.Boolean(), default=True),
        sa.Column('share_data_with_providers', sa.Boolean(), default=False),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('NOW()')),
    )


def downgrade() -> None:
    op.drop_table('notification_preferences')
    op.drop_index('idx_messages_received_at')
    op.drop_index('idx_messages_message_type')
    op.drop_index('idx_messages_status')
    op.drop_index('idx_messages_provider_id')
    op.drop_index('idx_messages_user_id')
    op.drop_table('messages')



