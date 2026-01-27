-- ✅ BATCH 1.1: Add new fields to contracts and support_tickets
-- Date: 2025-12-17
-- Purpose: Add fields for Bill Parser and AI Ticket Classification

-- 1. Add fields to contracts table
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS contract_file_url VARCHAR,
ADD COLUMN IF NOT EXISTS last_parsed_at TIMESTAMP;

-- 2. Create enum type for ticket types
DO $$ BEGIN
    CREATE TYPE tickettype AS ENUM ('complaint', 'switch_request', 'question', 'system_notice');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Add type column to support_tickets
ALTER TABLE support_tickets 
ADD COLUMN IF NOT EXISTS type tickettype DEFAULT 'question' NOT NULL;

-- 4. Create index on type for faster queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);

-- Verify changes
SELECT 'Migration completed successfully' AS status;



