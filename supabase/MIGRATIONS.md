# Migrazioni Supabase — MotoGarage

Esegui le migration nell’ordine indicato tramite **Supabase Dashboard → SQL Editor → New query → incolla → Run**.

Su un progetto **nuovo**, parti da `schema.sql` e poi applica le migration elencate sotto.

## Ordine consigliato

### 1. Base (progetto nuovo)

| File | Descrizione |
|------|-------------|
| `schema.sql` | Schema iniziale: itinerari, profili, community, garage base |

### 2. Funzionalità principali

| File | Descrizione |
|------|-------------|
| `migration_profilo.sql` | Campi profilo utente |
| `migration_foto.sql` | Foto community |
| `migration_commenti.sql` | Commenti |
| `migration_likes.sql` | Like |
| `migration_giri.sql` | Tabella giri GPS |
| `migration_giri_update.sql` | **Aggiornamenti giri** (statistiche, visibilità, card) |
| `migration_giri_pubblici.sql` | Giri pubblici nel feed |
| `migration_giri_card.sql` | Metadati card social |
| `migration_garage.sql` | Garage digitale e moto 3D |
| `migration_moto_scheda.sql` | **Categoria moto e scheda modifiche** (`categoria`, `scheda_modifiche`) |
| `migration_garage_libero.sql` | Garage accessibile a tutti gli utenti |
| `migration_garage_generazione_utente.sql` | Generazione 3D senza service_role su Vercel |
| `migration_motogarage.sql` | Policy garage, formati splat, stato `in_attesa` |

### 3. Community e contenuti

| File | Descrizione |
|------|-------------|
| `migration_blog.sql` | Articoli blog |
| `migration_classifica.sql` | Classifica km |
| `migration_regioni.sql` | Regioni itinerari |
| `migration_origine.sql` | Origine itinerari (verificato/classico) |
| `migration_lista_attesa.sql` | Lista attesa Pro |

### 4. Admin e sicurezza

| File | Descrizione |
|------|-------------|
| `migration_admin.sql` | Ruoli admin |
| `migration_sicurezza.sql` | Policy RLS aggiuntive |
| `migration_foto_sicura.sql` | Storage foto sicuro |
| `migration_foto_geo.sql` | Geo-tag foto |

### 5. Reset / manutenzione (solo se necessario)

| File | Descrizione |
|------|-------------|
| `migration_commenti_reset.sql` | Reset commenti |
| `migration_foto_reset.sql` | Reset foto |

## Migration da non saltare (funzioni recenti)

Se l’app segnala errori su colonne mancanti, esegui subito:

1. **`migration_moto_scheda.sql`** — richiesto per scheda moto e categoria nel garage (`categoria`, `scheda_modifiche`).
2. **`migration_giri_update.sql`** — richiesto per statistiche e aggiornamenti giri GPS.

Messaggio tipico in app: *«Esegui migration_moto_scheda.sql su Supabase»*.

## Come eseguire una migration

1. Apri [Supabase Dashboard](https://supabase.com/dashboard) del tuo progetto.
2. Vai su **SQL Editor**.
3. Clicca **New query**.
4. Apri il file `.sql` dal cartella `supabase/` del repo e copia tutto il contenuto.
5. Incolla nell’editor e premi **Run**.
6. Verifica che non ci siano errori in rosso.

## Seed (opzionale)

| File | Descrizione |
|------|-------------|
| `seed.sql` | Dati demo base |
| `seed_abruzzo.sql` | Itinerari Abruzzo |
| `seed_classici.sql` | Itinerari classici |

Esegui i seed solo dopo lo schema e le migration necessarie.

## Verifica rapida

- Garage: crea una moto da `/garage` senza errori su `categoria` / `scheda_modifiche`.
- Giri: traccia un giro da `/traccia` e salva senza errori sulle colonne giri.
- Health API: `/api/garage/health` risponde `ok: true` (con token HF configurato).
