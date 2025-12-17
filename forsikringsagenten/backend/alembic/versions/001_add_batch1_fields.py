"""Add BATCH 1 fields: contract_file_url, last_parsed_at, support_ticket.type

Revision ID: 001_batch1_fields
Revises: 
Create Date: 2025-12-17

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_batch1_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new fields to contracts table
    op.add_column('contracts', sa.Column('contract_file_url', sa.String(), nullable=True))
    op.add_column('contracts', sa.Column('last_parsed_at', sa.DateTime(), nullable=True))
    
    # Create enum type for ticket types
    ticket_type_enum = postgresql.ENUM('complaint', 'switch_request', 'question', 'system_notice', name='tickettype')
    ticket_type_enum.create(op.get_bind(), checkfirst=True)
    
    # Add type column to support_tickets
    op.add_column('support_tickets', sa.Column('type', ticket_type_enum, nullable=False, server_default='question'))


def downgrade() -> None:
    # Remove columns
    op.drop_column('support_tickets', 'type')
    op.drop_column('contracts', 'last_parsed_at')
    op.drop_column('contracts', 'contract_file_url')
    
    # Drop enum type
    ticket_type_enum = postgresql.ENUM('complaint', 'switch_request', 'question', 'system_notice', name='tickettype')
    ticket_type_enum.drop(op.get_bind(), checkfirst=True)
