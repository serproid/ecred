create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'novo',
  name text,
  cpf text,
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
