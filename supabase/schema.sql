-- ============================================================
-- Bring Gift Card — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- It creates the tables, seeds default rates/settings, and sets up
-- RLS so the public site can READ (anon) and the Admin panel can
-- WRITE (via the service role key used by the API routes).
-- ============================================================

-- ---------- Table: rates ----------
-- One row per tradeable asset. `rate` = payout units per 1 USD face value.
create table if not exists public.rates (
  key         text primary key,
  rate        numeric not null default 1000,
  active      boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ---------- Table: settings ----------
-- A single row (id = 1) holding site-wide editable settings.
create table if not exists public.settings (
  id               integer primary key default 1,
  whatsapp_number  text not null default '2348000000000',
  email            text not null default 'support@bringgiftcard.com',
  address          text not null default '13B Ikosi Road, Ketu, Lagos, Nigeria',
  constraint settings_singleton check (id = 1)
);

-- ---------- Seed: settings singleton ----------
insert into public.settings (id, whatsapp_number, email, address)
values (1, '2348000000000', 'support@bringgiftcard.com', '13B Ikosi Road, Ketu, Lagos, Nigeria')
on conflict (id) do nothing;

-- ---------- Seed: default rates ----------
insert into public.rates (key, rate, active) values
  ('steam',       1285, true),
  ('apple',       1210, true),
  ('amazon',      1150, true),
  ('google',      1120, true),
  ('xbox',        1100, true),
  ('playstation', 1095, true),
  ('visa',        1080, true),
  ('vanilla',     1070, true),
  ('walmart',     1110, true),
  ('sephora',     1135, true),
  ('nike',        1140, true),
  ('netflix',     1075, true),
  ('ebay',        1125, true),
  ('spotify',     1060, true),
  ('usdt',        1540, true),
  ('btc',         1530, true),
  ('eth',         1510, true)
on conflict (key) do nothing;

-- ---------- Auto-update updated_at ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_rates_touch on public.rates;
create trigger trg_rates_touch before update on public.rates
for each row execute function public.touch_updated_at();

-- ============================================================
-- Row Level Security
-- Public (anon) can READ. Writes are done server-side with the
-- SERVICE ROLE key inside the API routes, which bypasses RLS —
-- so we only need to open read access to anon.
-- ============================================================

alter table public.rates    enable row level security;
alter table public.settings enable row level security;

-- Public read access (used by the website + public API routes).
drop policy if exists "public read rates" on public.rates;
create policy "public read rates"
  on public.rates for select
  using (true);

drop policy if exists "public read settings" on public.settings;
create policy "public read settings"
  on public.settings for select
  using (true);

-- NOTE: No INSERT/UPDATE/DELETE policies for anon.
-- The Admin API routes use the SERVICE ROLE key (SUPABASE_SERVICE_ROLE_KEY),
-- which ignores RLS entirely, so writes only happen through authenticated
-- admin endpoints guarded by the JWT session cookie.

-- Done. Verify with:
--   select * from public.rates order by rate desc;
--   select * from public.settings;
