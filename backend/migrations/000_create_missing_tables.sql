-- Create missing tables: contracts and support_tickets
-- Date: 2025-12-17

-- 1. Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    category VARCHAR NOT NULL,
    provider VARCHAR NOT NULL,
    name VARCHAR,
    monthly_price NUMERIC(10, 2),
    currency VARCHAR DEFAULT 'DKK',
    details JSONB,
    start_date DATE,
    end_date DATE,
    binding_period_months INTEGER,
    status VARCHAR DEFAULT 'active',
    contract_file_url VARCHAR,  -- ✅ BATCH 1.1
    last_parsed_at TIMESTAMP,   -- ✅ BATCH 1.1
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_category ON contracts(category);
CREATE INDEX IF NOT EXISTS idx_contracts_provider ON contracts(provider);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- 2. Create tickettype enum
DO $$ BEGIN
    CREATE TYPE tickettype AS ENUM ('complaint', 'switch_request', 'question', 'system_notice');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    contract_id VARCHAR REFERENCES contracts(id),
    provider_id VARCHAR REFERENCES providers(id),
    category VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    description TEXT NOT NULL,
    type tickettype DEFAULT 'question' NOT NULL,  -- ✅ BATCH 1.1
    status VARCHAR DEFAULT 'open',
    priority VARCHAR DEFAULT 'normal',
    messages JSON DEFAULT '[]',
    internal_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);

-- Verify
SELECT 'Tables created successfully' AS status;



