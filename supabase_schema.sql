-- Supabase Initial Schema for Majma' Platform
-- This script contains the full initial schema for the platform.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (Members)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'MEMBRE',
    category TEXT DEFAULT 'Étudiant',
    matricule TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    address TEXT,
    bio TEXT,
    avatar_url TEXT,
    birth_date DATE,
    gender TEXT,
    join_date DATE,
    coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}',
    level TEXT,
    commissions JSONB DEFAULT '[]',
    personal_info JSONB DEFAULT '{}',
    academic_info JSONB DEFAULT '{}',
    professional_info JSONB DEFAULT '{}',
    documents JSONB DEFAULT '[]',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contributions
CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    event_label TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    organizing_commission TEXT,
    description TEXT,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    commission TEXT NOT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'todo',
    due_date DATE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    comments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meeting Reports
CREATE TABLE IF NOT EXISTS meeting_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commission TEXT NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    type TEXT,
    attendees JSONB DEFAULT '[]',
    agenda JSONB DEFAULT '[]',
    discussions TEXT,
    decisions JSONB DEFAULT '[]',
    action_items JSONB DEFAULT '[]',
    status TEXT DEFAULT 'brouillon',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    confidentiality TEXT DEFAULT 'interne',
    admin_feedback TEXT,
    bureau_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'disponible',
    features JSONB DEFAULT '[]',
    ownership TEXT DEFAULT 'internal',
    maintenance JSONB DEFAULT '{}',
    external_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    license_type TEXT,
    status TEXT DEFAULT 'disponible',
    phone TEXT,
    trips_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trips (Transport Schedules)
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT,
    event_title TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    stops JSONB DEFAULT '[]',
    assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'planifie',
    seats_filled INTEGER DEFAULT 0,
    total_capacity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    passenger TEXT NOT NULL,
    phone TEXT,
    trip TEXT,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    seat TEXT,
    status TEXT DEFAULT 'payé',
    type TEXT DEFAULT 'Aller-Retour',
    amount DECIMAL(12, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Library Resources
CREATE TABLE IF NOT EXISTS library_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT,
    type TEXT NOT NULL,
    category TEXT,
    access_level TEXT DEFAULT 'public',
    url TEXT,
    views INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Khassaide Modules
CREATE TABLE IF NOT EXISTS khassaide_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT,
    level TEXT,
    progress INTEGER DEFAULT 0,
    lessons JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial Reports
CREATE TABLE IF NOT EXISTS financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commission TEXT NOT NULL,
    period TEXT,
    start_date DATE,
    end_date DATE,
    total_budget_allocated DECIMAL(15, 2) DEFAULT 0,
    total_expenses DECIMAL(15, 2) DEFAULT 0,
    balance DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'brouillon',
    submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expenses JSONB DEFAULT '[]',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budget Requests
CREATE TABLE IF NOT EXISTS budget_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commission TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    priority TEXT,
    timeline JSONB DEFAULT '{}',
    expected_outcomes TEXT,
    amount_requested DECIMAL(15, 2) NOT NULL,
    amount_approved DECIMAL(15, 2),
    status TEXT DEFAULT 'soumis_finance',
    submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    breakdown JSONB DEFAULT '[]',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adiya Campaigns
CREATE TABLE IF NOT EXISTS adiya_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    unit_amount DECIMAL(12, 2) DEFAULT 0,
    target_amount DECIMAL(15, 2),
    deadline DATE,
    status TEXT DEFAULT 'open',
    participants JSONB DEFAULT '[]',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fundraising Events
CREATE TABLE IF NOT EXISTS fundraising_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'active',
    deadline DATE,
    groups JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Social Projects
CREATE TABLE IF NOT EXISTS social_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    theme TEXT,
    description TEXT,
    target_amount DECIMAL(15, 2),
    current_amount DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'actif',
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Social Posts
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE,
    time TIME,
    status TEXT,
    platforms JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    qty INTEGER DEFAULT 0,
    condition TEXT,
    sub TEXT,
    next_check DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Social Cases
CREATE TABLE IF NOT EXISTS social_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT,
    description TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partners
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT,
    location TEXT,
    contact TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Study Groups
CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    theme TEXT,
    members_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cultural Activities
CREATE TABLE IF NOT EXISTS cultural_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT,
    date DATE,
    time TIME,
    location TEXT,
    organizing_commission TEXT,
    description TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crisis Scenarios
CREATE TABLE IF NOT EXISTS crisis_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT,
    steps JSONB DEFAULT '[]',
    contacts JSONB DEFAULT '[]',
    communication_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Active Crises
CREATE TABLE IF NOT EXISTS active_crises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scenario_id UUID REFERENCES crisis_scenarios(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    log JSONB DEFAULT '[]',
    completed_steps JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Anomalies
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric TEXT NOT NULL,
    value DECIMAL(15, 2),
    expected DECIMAL(15, 2),
    deviation TEXT,
    severity TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attrition Risks
CREATE TABLE IF NOT EXISTS attrition_risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT,
    risk_score DECIMAL(5, 2),
    factors JSONB DEFAULT '[]',
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
