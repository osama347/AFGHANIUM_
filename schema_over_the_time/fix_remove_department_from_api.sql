-- Hotfix: remove legacy NEW.department usage from DB trigger functions.
-- Run this in Supabase SQL Editor against the active project.

-- 1) Inspect any TRIGGER FUNCTIONS that still reference NEW.department.
-- We explicitly filter to regular functions (prokind = 'f') and trigger return type,
-- so aggregates like array_agg are excluded.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join pg_type t on t.oid = p.prorettype
where lower(pg_get_functiondef(p.oid)) like '%new.department%'
  and p.prokind = 'f'
  and t.typname = 'trigger';

-- 2) Recreate donation confirmation function without department payload.
create or replace function public.send_donation_confirmation()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url := (select value from public.site_content where key = 'supabase_url') || '/functions/v1/send-donation-confirmation',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select value from public.site_content where key = 'supabase_service_key')
    ),
    body := jsonb_build_object(
      'donation_id', new.donation_id,
      'full_name', new.full_name,
      'email', new.email,
      'amount', new.amount,
      'payment_method', new.payment_method,
      'message', new.message
    )
  );

  return new;
exception
  when others then
    -- Do not block donation inserts if email delivery fails.
    raise warning 'send_donation_confirmation failed for donation_id %: %', new.donation_id, sqlerrm;
    return new;
end;
$$;

drop trigger if exists trigger_send_donation_confirmation on public.donations;
create trigger trigger_send_donation_confirmation
after insert on public.donations
for each row
execute function public.send_donation_confirmation();

-- 3) Optional: inspect triggers attached to donations/impacts and the function they execute.
select
  tg.tgname as trigger_name,
  c.relname as table_name,
  pn.nspname as function_schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as function_args
from pg_trigger tg
join pg_class c on c.oid = tg.tgrelid
join pg_proc p on p.oid = tg.tgfoid
join pg_namespace pn on pn.oid = p.pronamespace
where not tg.tgisinternal
  and c.relname in ('donations', 'impacts')
order by c.relname, tg.tgname;

-- 4) If step (1) still returns rows, use CREATE OR REPLACE FUNCTION for each listed
-- trigger function signature. Avoid DROP FUNCTION against unknown names, as that can
-- accidentally target non-function objects in some setups.
