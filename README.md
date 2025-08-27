# Client Information App

A simple web application for capturing client information with cloud database storage.

## Features

- Comprehensive client intake form matching your spreadsheet format
- Cloud database storage via Supabase
- Responsive design
- Serverless deployment on Netlify

## Setup Instructions

### 1. Create Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. In the SQL Editor, run this query to create the clients table:

```sql
-- Create clients table with ALL fields from spreadsheet
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    clientName TEXT,
    caseManager TEXT,
    moveInDate DATE,
    cityNumber TEXT,
    housingLocation TEXT,
    leaseEndDate DATE,
    exitDate DATE,
    rentAmount DECIMAL(10,2),
    firstPayment DATE,
    rentPaid DECIMAL(10,2),
    utilityPaid DECIMAL(10,2),
    leaseDeposit DECIMAL(10,2),
    depositRefund DECIMAL(10,2),
    utilitiesDeposit DECIMAL(10,2),
    membersOnLease INTEGER,
    landlordName TEXT,
    landlordContact TEXT,
    employerIncome TEXT,
    benefits TEXT,
    workStatus TEXT,
    jobLeads TEXT,
    upcomingInterviews TEXT,
    primaryGoal TEXT,
    secondaryGoal TEXT,
    month TEXT,
    results TEXT,
    familyReunification TEXT,
    medicallyOnHold TEXT,
    medicallyVulnerable TEXT,
    familiesSeniorsVeterans TEXT,
    supportProgram TEXT,
    elevator TEXT,
    delivery TEXT,
    transportation TEXT,
    followUp TEXT,
    housingSchedule TEXT,
    comments TEXT,
    status TEXT,
    notes TEXT,
    recordRequest TEXT,
    supportServicesReferred TEXT,
    assessmentCompleted TEXT,
    otherNotes TEXT,
    lastPaymentDate DATE,
    lastContactDate DATE,
    nextContactDate DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create notes table for tracking client interactions
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX idx_client_name ON clients(clientName);
CREATE INDEX idx_housing_location ON clients(housingLocation);
CREATE INDEX idx_status ON clients(status);
CREATE INDEX idx_notes_client_id ON notes(client_id);
```

4. Copy your Project URL and Service Role Key from Settings > API

### 2. Deploy to Netlify

1. Push this code to a GitHub repository
2. Connect your GitHub repo to Netlify
3. Add these environment variables in Netlify:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key

### 3. Local Development

1. Install dependencies: `npm install`
2. Create a `.env` file with your Supabase credentials
3. Run locally: `npm run dev`

## Database Schema

The app captures all the fields from your spreadsheet including:
- Basic client information
- Housing details and payments
- Demographics and status
- Employment and benefits
- Goals and services
- Notes and interactions

## Cost

- Supabase: Free tier (500MB database, 2GB bandwidth)
- Netlify: Free tier (100GB bandwidth, 300 build minutes)
- Total monthly cost: **$0** for moderate usage