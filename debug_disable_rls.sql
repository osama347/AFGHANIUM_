-- DANGER: DEBUGGING ONLY
-- This script DISABLES security policies to verify if RLS is the cause of disappearing campaigns.
-- Run this in Supabase SQL Editor.

-- 1. Disable Row Level Security completely for the table
ALTER TABLE emergency_campaigns DISABLE ROW LEVEL SECURITY;

-- 2. Grant full permissions to everyone (just to be absolutely sure)
GRANT ALL ON emergency_campaigns TO anon, authenticated, service_role;

-- 3. Verify the table exists and has data
SELECT count(*) as total_campaigns FROM emergency_campaigns;
