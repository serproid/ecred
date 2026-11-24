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
  paid_at timestamptz
);

alter table public.leads enable row level security;

drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public" on public.leads
  for insert to anon, authenticated with check (true);

drop policy if exists "leads_update_public" on public.leads;
create policy "leads_update_public" on public.leads
  for update to anon, authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant insert, update on public.leads to anon, authenticated;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_cpf_idx on public.leads (cpf);
create index if not exists leads_status_idx on public.leads (status);
