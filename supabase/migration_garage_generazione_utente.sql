-- Permette la generazione gemelli senza service_role sul server (Vercel).
-- Esegui nel SQL Editor di Supabase dopo migration_garage_libero.sql.

create or replace function public.proteggi_modello_moto()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.role() = 'service_role' then
    return new;
  end if;

  if auth.uid() = old.utente_id then
    if (new.model_url is distinct from old.model_url
        or new.glb_url is distinct from old.glb_url
        or new.model_format is distinct from old.model_format)
       and not (
         old.stato in ('in_attesa', 'elaborazione', 'errore')
         and new.stato in ('elaborazione', 'pronto', 'errore')
       ) then
      raise exception 'Pubblicazione modello non consentita in questo stato';
    end if;

    if new.stato = 'pronto'
       and (old.stato <> 'elaborazione' or coalesce(new.model_url, new.glb_url) is null) then
      raise exception 'Il gemello non è ancora pronto per la pubblicazione';
    end if;

    return new;
  end if;

  if new.model_url is distinct from old.model_url
    or new.glb_url is distinct from old.glb_url
    or new.model_format is distinct from old.model_format
    or new.stato is distinct from old.stato
    or new.progress is distinct from old.progress
    or new.provider is distinct from old.provider
    or new.task_id is distinct from old.task_id
    or new.errore is distinct from old.errore then
    raise exception 'I campi del modello sono gestiti dal server MotoGarage';
  end if;

  return new;
end;
$$;

drop policy if exists "pubblica modello proprio" on storage.objects;
drop policy if exists "elimina modello proprio" on storage.objects;

create policy "pubblica modello proprio"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'modelli-3d'
    and exists (
      select 1
      from public.moto m
      where m.id::text = (storage.foldername(name))[1]
        and m.utente_id = auth.uid()
    )
  );

create policy "elimina modello proprio"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'modelli-3d'
    and exists (
      select 1
      from public.moto m
      where m.id::text = (storage.foldername(name))[1]
        and m.utente_id = auth.uid()
    )
  );
