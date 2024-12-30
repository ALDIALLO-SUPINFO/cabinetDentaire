-- Create appointments table
create table if not exists public.appointments (
    id bigint primary key generated always as identity,
    patient_id bigint references public.patients(id) on delete cascade,
    date_heure timestamp with time zone not null,
    duree interval not null default '30 minutes',
    motif text not null,
    notes text,
    statut text not null default 'planifié',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint appointments_status_check check (statut in ('planifié', 'confirmé', 'annulé', 'terminé'))
);

-- Enable RLS
alter table public.appointments enable row level security;

-- Create policy
create policy "Allow all operations for authenticated users"
    on public.appointments
    for all
    using (true)
    with check (true);

-- Create indexes
create index appointments_patient_id_idx on public.appointments(patient_id);
create index appointments_date_heure_idx on public.appointments(date_heure);
create index appointments_statut_idx on public.appointments(statut);
