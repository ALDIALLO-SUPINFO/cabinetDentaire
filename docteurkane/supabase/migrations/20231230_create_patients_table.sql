-- Create patients table
create table if not exists public.patients (
    id bigint primary key generated always as identity,
    nom text not null,
    prenom text not null,
    date_naissance date not null,
    telephone text,
    email text,
    adresse text,
    numero_secu text,
    antecedents text,
    allergies text,
    traitements_actuels text,
    assurance text,
    mutuelle text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.patients enable row level security;

-- Create policy to allow all operations for authenticated users
create policy "Allow all operations for authenticated users"
    on public.patients
    for all
    using (true)
    with check (true);

-- Create indexes
create index if not exists patients_nom_prenom_idx on public.patients (nom, prenom);
create index if not exists patients_numero_secu_idx on public.patients (numero_secu);
