-- Supabase SQL Migration: Create schemes table
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- 1. Enable UUID extension (optional, using text IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the schemes table
CREATE TABLE IF NOT EXISTS schemes (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    about TEXT,
    objective TEXT,
    who_can_apply JSONB DEFAULT '[]'::jsonb,
    eligibility JSONB DEFAULT '[]'::jsonb,
    not_eligible JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    apply_process JSONB DEFAULT '[]'::jsonb,
    apply_online_url TEXT,
    apply_offline JSONB DEFAULT '[]'::jsonb,
    last_date TEXT,
    helpline TEXT,
    faqs JSONB DEFAULT '[]'::jsonb,
    related_schemes JSONB DEFAULT '[]'::jsonb,
    official_website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (optional — public read-only for anon key)
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read access (anon key can SELECT)
CREATE POLICY "Allow public read access" ON schemes
    FOR SELECT USING (true);

-- 5. Allow authenticated users to insert/update (optional)
CREATE POLICY "Allow service role full access" ON schemes
    FOR ALL USING (auth.role() = 'service_role');

-- 6. Index for faster queries
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes (category);

-- ============================================================
-- Seed data: Insert all 32 schemes
-- Each row is inserted as a complete JSON object.
-- Arrays are stored as JSONB arrays.
-- FAQs are stored as [{"q": "...", "a": "..."}].
-- ============================================================

-- See the attached seed-data.sql for the full 32-scheme data.
-- You can generate the seed data from the existing SchemeRepository.java
-- using any JSON conversion tool, or insert manually via the Supabase dashboard.
