-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    client_name TEXT,
    clientName TEXT,
    date_of_birth DATE,
    age INTEGER,
    phone_primary TEXT,
    phone_secondary TEXT,
    email TEXT,
    current_address TEXT,
    mailing_address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    housing_location TEXT,
    housingLocation TEXT,
    housing_stabilizer TEXT,
    caseManager TEXT,
    intake_date DATE,
    monthly_rent REAL,
    monthly_income REAL,
    employment_status TEXT,
    employer_name TEXT,
    hours_per_week INTEGER,
    income_verification_date DATE,
    lease_start_date DATE,
    lease_end_date DATE,
    next_review_date DATE,
    end_date_services DATE,
    services_requested TEXT,
    priority_score INTEGER,
    signature_client TEXT,
    signature_date DATE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    content TEXT NOT NULL,
    visit_type TEXT DEFAULT 'office_visit',
    category TEXT DEFAULT 'general',
    outcome TEXT DEFAULT 'successful',
    next_steps TEXT,
    stabilizer TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(client_name);
CREATE INDEX IF NOT EXISTS idx_clients_stabilizer ON clients(housing_stabilizer);
CREATE INDEX IF NOT EXISTS idx_clients_location ON clients(housing_location);
CREATE INDEX IF NOT EXISTS idx_notes_client_id ON notes(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);