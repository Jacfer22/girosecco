-- Rende i giri condivisibili nel feed community (opzionale, scelta dell'utente).
-- Esegui in Supabase: SQL Editor -> New query -> Run. Sicuro da rieseguire.

-- Flag: il giro è visibile nel feed pubblico? (default no, privacy first)
alter table public.giri add column if not exists pubblico boolean not null default false;

-- I giri pubblici sono leggibili da tutti (per il feed). Quelli privati no.
drop policy if exists "giri pubblici leggibili da tutti" on public.giri;
create policy "giri pubblici leggibili da tutti" on public.giri
  for select using (pubblico = true);

-- (resta attiva anche la policy "giri propri leggibili": ognuno vede comunque i suoi)
