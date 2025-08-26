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
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    clientName TEXT,
    caseManager TEXT,
    moveInDate DATE,
    housingLocation TEXT,
    rentAmount DECIMAL(10,2),
    firstPayment DATE,
    exitDate DATE,
    housingStatus TEXT,
    paymentsMade INTEGER,
    rentPaid DECIMAL(10,2),
    utilityPaid DECIMAL(10,2),
    veteranStatus TEXT,
    chronicHomeless TEXT,
    familyWithChildren TEXT,
    employerIncome TEXT,
    benefits TEXT,
    workStatus TEXT,
    primaryGoal TEXT,
    secondaryGoal TEXT,
    servicesReceived TEXT,
    upcomingInteractions TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
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