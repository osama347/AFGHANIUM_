-- FIX: Emergency Campaigns Disappearing Issue
-- Run this script in your Supabase SQL Editor to fix permissions

-- 1. Enable RLS (Row Level Security)
ALTER TABLE emergency_campaigns ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to start fresh and avoid conflicts
DROP POLICY IF EXISTS "Anyone can view active emergency campaigns" ON emergency_campaigns;
DROP POLICY IF EXISTS "Admins can manage emergency campaigns" ON emergency_campaigns;
DROP POLICY IF EXISTS "Admins can view all campaigns" ON emergency_campaigns;
DROP POLICY IF EXISTS "Public view active" ON emergency_campaigns;
DROP POLICY IF EXISTS "Admin full access" ON emergency_campaigns;

-- 3. Create correct policies

-- Policy 1: Public can ONLY view ACTIVE campaigns
CREATE POLICY "Public view active"
ON emergency_campaigns FOR SELECT
TO anon
USING (is_active = true);

-- Policy 2: Authenticated users (Admins) can view ALL campaigns (active & inactive)
CREATE POLICY "Admin view all"
ON emergency_campaigns FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authenticated users (Admins) can INSERT, UPDATE, DELETE
CREATE POLICY "Admin manage all"
ON emergency_campaigns FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Ensure the view has correct permissions
GRANT SELECT ON emergency_campaigns_with_stats TO anon, authenticated;

-- 5. Ensure UUID extension is available (needed for ID generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
