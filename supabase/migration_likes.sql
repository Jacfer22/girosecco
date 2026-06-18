-- "Mi piace" su foto e giri. Una sola tabella per entrambi i tipi.
-- Esegui in Supabase: SQL Editor -> New query -> Run. Sicuro da rieseguire.

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  utente_id uuid not null references public.profiles(id) on delete cascade,
  -- tipo di contenuto: 'foto' oppure 'giro'
  tipo text not null check (tipo in ('foto', 'giro')),
  -- id del contenuto (foto.id o giri.id)
  contenuto_id uuid not null,
  created_at timestamptz not null default now()
);

-- un utente può mettere un solo like allo stesso contenuto
create unique index if not exists likes_unici_idx
  on public.likes (utente_id, tipo, contenuto_id);

-- per contare velocemente i like di un contenuto
create index if not exists likes_contenuto_idx
  on public.likes (tipo, contenuto_id);

alter table public.likes enable row level security;

-- Tutti possono leggere i like (per contarli e mostrare il cuore pieno)
drop policy if exists "like leggibili da tutti" on public.likes;
create policy "like leggibili da tutti" on public.likes
  for select using (true);

-- Solo utenti loggati mettono like, e solo a proprio nome
drop policy if exists "utenti loggati mettono like" on public.likes;
create policy "utenti loggati mettono like" on public.likes
  for insert with check (auth.uid() = utente_id);

-- Ognuno toglie solo i propri like
drop policy if exists "utenti tolgono i propri like" on public.likes;
create policy "utenti tolgono i propri like" on public.likes
  for delete using (auth.uid() = utente_id);
