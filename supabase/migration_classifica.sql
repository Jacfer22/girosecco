-- Classifica km e ricerca utenti (aggregati sicuri, senza esporre giri privati singoli).
-- Esegui in Supabase: SQL Editor → Run. Sicuro da rieseguire.

-- Classifica: somma km di tutti i giri per utente (solo totali pubblici, non tracciati singoli).
create or replace function public.classifica_km(limit_n int default 50)
returns table (
  utente_id uuid,
  username text,
  avatar_url text,
  moto text,
  is_pro boolean,
  km_totali numeric,
  giri_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.avatar_url,
    p.moto,
    p.is_pro,
    coalesce(sum(g.km), 0)::numeric as km_totali,
    count(g.id)::bigint as giri_count
  from public.profiles p
  inner join public.giri g on g.utente_id = p.id
  where p.username is not null
  group by p.id
  having coalesce(sum(g.km), 0) > 0
  order by km_totali desc, giri_count desc
  limit greatest(1, least(limit_n, 100));
$$;

revoke all on function public.classifica_km(int) from public;
grant execute on function public.classifica_km(int) to anon, authenticated;
