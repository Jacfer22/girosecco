-- MotoGarage — garage libero per tutti gli utenti registrati + upload foto senza Pro.
-- Esegui nel SQL Editor di Supabase dopo migration_motogarage.sql.

drop policy if exists "proprietario pro crea moto" on public.moto;

create policy "proprietario crea moto"
  on public.moto for insert
  with check (
    auth.uid() = utente_id
    and stato = 'in_attesa'
  );

drop policy if exists "upload foto moto" on storage.objects;

create policy "upload foto moto"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'foto-moto'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
