-- Consente aggiornamento nome e visibilità community dei propri giri.
-- Esegui in Supabase: SQL Editor → Run. Sicuro da rieseguire.

drop policy if exists "utenti aggiornano i propri giri" on public.giri;
create policy "utenti aggiornano i propri giri" on public.giri
  for update using (auth.uid() = utente_id)
  with check (auth.uid() = utente_id);
