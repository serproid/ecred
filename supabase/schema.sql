create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'novo',
  name text,
  cpf text,
  cpf_situation text,
  cpf_death_year integer,
  cpf_checked boolean default false,
  birth_date text,
  mother_name text,
  gender text,
  phone text,
  email text,
  amount numeric,
  installments integer,
  purpose text,
  occupation text,
  negativado text,
  salary numeric,
  no_income boolean default false,
  income_day integer,
  approved_amount numeric,
  payment_day integer,
  cep text,
  street text,
  number text,
  no_number boolean default false,
  complement text,
  district text,
  city text,
  uf text,
  seguro_product_id text,
  seguro_price numeric,
  seguro_extra numeric,
  checkout_total numeric,
  checkout_loan numeric,
  checkout_bump_ids text[],
  pix_transaction_id text,
  pix_code text,
  pix_status text,
  pix_error text,
  paid_at timestamptz,
  user_id uuid default auth.uid()
);

alter table public.leads enable row level security;

drop policy if exists "leads_insert_public" on public.leads;
drop policy if exists "leads_insert_authenticated" on public.leads;
drop policy if exists "leads_update_public" on public.leads;
drop policy if exists "leads_update_own" on public.leads;
drop policy if exists "leads_select_own" on public.leads;

create policy "leads_insert_authenticated" on public.leads
  for insert to authenticated with check (true);

create policy "leads_update_own" on public.leads
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "leads_select_own" on public.leads
  for select to authenticated using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
revoke insert, update on public.leads from anon;
grant insert, update, select on public.leads to authenticated;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_cpf_idx on public.leads (cpf);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_user_id_idx on public.leads (user_id);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  cpf text unique,
  name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

grant usage on schema public to authenticated;
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.profiles to service_role;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, cpf, name, email)
  values (
    new.id,
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cpf',''), '\D', '', 'g'), ''),
    new.raw_user_meta_data->>'name',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null default now()
);

alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon, authenticated;

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_count integer;
  v_reset timestamptz;
  v_retry integer;
begin
  insert into public.rate_limits (key, count, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set count = case when public.rate_limits.reset_at < now() then 1 else public.rate_limits.count + 1 end,
        reset_at = case when public.rate_limits.reset_at < now() then now() + make_interval(secs => p_window_seconds) else public.rate_limits.reset_at end
  returning count, reset_at into v_count, v_reset;

  v_retry := greatest(0, ceil(extract(epoch from (v_reset - now())))::int);
  return jsonb_build_object('allowed', v_count <= p_limit, 'count', v_count, 'retryAfter', v_retry);
end;
$$;

grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
