-- Supabase schema for Bualoi Relief Fund
create table if not exists public.donations (
	id uuid primary key default gen_random_uuid(),
	tx_hash text unique not null,
	from_wallet text,
	to_wallet text,
	amount numeric not null,
	datetime timestamptz not null default now(),
	bank_reference text,
	recipient_org text,
	status text not null default 'Pending'
);

-- Helpful indexes
create index if not exists donations_datetime_idx on public.donations (datetime desc);
create index if not exists donations_status_idx on public.donations (status);


