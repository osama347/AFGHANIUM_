-- Fix for Homepage Statistics showing $0
-- Run this in your Supabase SQL Editor

-- 1. Enable RLS on donations table (if not already enabled)
alter table public.donations enable row level security;

-- 2. Allow public (anonymous) users to view COMPLETED donations
-- This is required for the Homepage Stats and Ticker to work
create policy "Public can view completed donations"
on public.donations for select
to anon, authenticated
using (lower(status) = 'completed');

-- 3. Allow public to view impacts (for "Lives Impacted" stat)
alter table public.impacts enable row level security;

create policy "Public can view impacts"
on public.impacts for select
to anon, authenticated
using (true);

-- 4. Check if your donations have the correct status
-- This query shows you what statuses you currently have:
select status, count(*) from public.donations group by status;
