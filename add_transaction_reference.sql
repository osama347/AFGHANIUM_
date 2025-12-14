-- Add transaction_reference column to donations table
-- This fixes the "Could not find the 'transaction_reference' column" error
-- Run this in your Supabase SQL Editor

-- Add the transaction_reference column if it doesn't exist
ALTER TABLE public.donations
ADD COLUMN IF NOT EXISTS transaction_reference TEXT;

-- Ensure all required columns exist (based on the current code)
ALTER TABLE public.donations
ADD COLUMN IF NOT EXISTS message TEXT;

-- Add check constraint for status if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints
        WHERE constraint_name = 'donations_status_check'
    ) THEN
        ALTER TABLE public.donations
        ADD CONSTRAINT donations_status_check
        CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'));
    END IF;
END $$;

-- Verify the table structure
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'donations'
AND table_schema = 'public'
ORDER BY ordinal_position;