-- UPDATED Fix for Homepage Statistics
-- Run this in your Supabase SQL Editor

-- 1. Drop the old policy if it exists (to avoid conflicts)
drop policy if exists "Public can view completed donations" on public.donations;
drop policy if exists "Public can view valid donations" on public.donations;

-- 2. Create a new policy that allows public to view ALL valid donations (Pending + Completed)
-- This ensures that as soon as someone donates, it shows up on the ticker/stats
create policy "Public can view valid donations"
on public.donations for select
to anon, authenticated
using (status not in ('failed', 'cancelled'));

-- 3. Ensure impacts are visible
alter table public.impacts enable row level security;

drop policy if exists "Public can view impacts" on public.impacts;

create policy "Public can view impacts"
on public.impacts for select
to anon, authenticated
using (true);
