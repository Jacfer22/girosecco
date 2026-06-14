-- Migrazione: blog community (articoli scritti dagli utenti, moderati dall'admin)
-- Esegui in Supabase: SQL Editor → New query → incolla tutto → Run

create table public.articoli (
  id uuid primary key default gen_random_uuid(),
  autore_id uuid not null references public.profiles(id) on delete cascade,
  titolo text not null,
  contenuto text not null,
  stato text not null default 'in_revisione' check (stato in ('in_revisione','pubblicato','rifiutato')),
  created_at timestamptz not null default now(),
  pubblicato_at timestamptz
);

alter table public.articoli enable row level security;

create policy "articoli pubblicati leggibili da tutti" on public.articoli for select using (stato = 'pubblicato');
create policy "autori leggono i propri articoli" on public.articoli for select using (auth.uid() = autore_id);
create policy "utenti loggati scrivono articoli" on public.articoli for insert with check (auth.uid() = autore_id);
create policy "autori modificano i propri articoli in revisione" on public.articoli for update using (
  auth.uid() = autore_id and stato = 'in_revisione'
);
create policy "admin modera articoli" on public.articoli for update using (
  exists (select 1 from public.profiles p2 where p2.id = auth.uid() and p2.is_admin = true)
);
