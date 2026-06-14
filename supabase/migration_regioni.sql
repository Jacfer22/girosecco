-- Migrazione: itinerari nazionali divisi per regione
-- Esegui in Supabase: SQL Editor → New query → incolla tutto → Run

alter table public.itinerari add column regioni text[] not null default '{}';

-- Popola le regioni dei 10 itinerari esistenti (Lazio; Tivoli-Carsoli anche Abruzzo)
update public.itinerari set regioni = array['lazio'] where regioni = '{}';
update public.itinerari set regioni = array['lazio','abruzzo'] where slug = 'tivoli-carsoli-montebove';
