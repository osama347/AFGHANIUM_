-- Fix for donation form submission issues
-- Run this in your Supabase SQL Editor

-- Enable RLS on donations table (if not already enabled)
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert new donations
CREATE POLICY "Public can insert donations"
ON public.donations FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow users to view their own donations (by donation_id)
CREATE POLICY "Users can view their own donations"
ON public.donations FOR SELECT
TO anon, authenticated
USING (true);  -- For now, allow viewing all donations. You may want to restrict this later.

-- Allow authenticated users (admins) to update donation status
CREATE POLICY "Admins can update donations"
ON public.donations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);