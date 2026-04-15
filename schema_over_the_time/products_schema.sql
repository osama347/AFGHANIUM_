-- Products table for Afghanium marketplace
create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    name_en text not null,
    category text,
    origin_region text default 'Afghanistan',
    description_en text,
    image_url text,
    inquiry_email text,
    display_order integer not null default 1,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_products_is_active on public.products (is_active);
create index if not exists idx_products_display_order on public.products (display_order);

alter table public.products enable row level security;

-- Public read for active products
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true);

-- Admin full access for authenticated users
drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Keep updated_at current
create or replace function public.update_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.update_products_updated_at();

-- Optional starter records
insert into public.products (name_en, category, origin_region, description_en, display_order, is_active)
values
  ('Afghan Saffron', 'Saffron', 'Herat', 'Premium Afghan saffron from local farmers with strong export quality.', 1, true),
  ('Handmade Afghan Rug', 'Rug', 'Northern Afghanistan', 'Traditional handwoven rug made by Afghan artisans.', 2, true),
  ('Afghan Leather Goods', 'Leather', 'Kabul', 'Handcrafted leather products from Afghan small workshops.', 3, true)
on conflict do nothing;
