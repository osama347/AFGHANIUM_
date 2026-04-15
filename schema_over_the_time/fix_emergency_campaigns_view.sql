-- Recreate emergency_campaigns_with_stats view if missing
-- Department-based joins were removed from donations.
create or replace view public.emergency_campaigns_with_stats as
select
    ec.*,
    0::numeric as current_amount,
    0::bigint as donation_count,
    0::numeric as progress_percentage
from public.emergency_campaigns ec;

grant select on public.emergency_campaigns_with_stats to anon, authenticated;
