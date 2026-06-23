---
name: marketing-motogarage
description: Strategia e operatività marketing MotoGarage — Instagram, contenuti, reel, calendario, crescita. Usa quando l'utente chiede marketing, profilo Instagram, lancio social, gestione canali, post, reel, crescita utenti, o menziona @marketing-motogarage. Solo su richiesta — mai pubblicare in automatico.
---

# Marketing MotoGarage — Agente principale

## Privacy (obbligatorio)

- **Mai** nome, email, username personali del founder nel copy, immagini, script o caption.
- Usa solo brand **MotoGarage**, account demo (`demo`), URL pubblico app (`NEXT_PUBLIC_SITE_URL`).
- Contenuti = prodotto e community, non persone fisiche.

## Stack consigliato (cosa usare quando)

| Esigenza | Strumento | Come |
|----------|-----------|------|
| Post singolo + caption | Skill `@social-motogarage` | `npm run social:post -- --stile logo\|story ...` |
| Kit completo lancio IG | `npm run social:starter-kit` | Logo + tour 3 mascotte — output in `social/starter-kit/` (privato) |
| Reel video demo app | Script reel | `npm run reel` (serve `REEL_GARAGE_USER=demo` in env) |
| Setup / bio Instagram | [instagram-profilo.md](../social-motogarage/instagram-profilo.md) | Guida passo passo |
| Calendario e funnel | [playbook.md](playbook.md) | Pillar rotation + metriche |
| Ricerca competitor / anteprima web | Browser MCP | Snapshot pagine pubbliche (solo lettura) |
| Automazione futura (opzionale) | Cursor Automations | **Solo trigger manuale o webhook** — mai cron giornaliero senza OK utente |

**Non esiste** connector Instagram ufficiale in Cursor: la pubblicazione resta manuale (tu carichi da telefono). L'agente prepara asset + copy.

## Workflow «Avvia profilo Instagram»

1. Leggi [instagram-profilo.md](../social-motogarage/instagram-profilo.md).
2. **Genera kit completo:** `npm run social:starter-kit` (logo + tour 9 step con Rosso, Blu, Nero).
3. Segui [social/starter-kit/README.md](../../social/starter-kit/README.md) — ordine upload.
4. Caption in [CAPTIONS.md](../../social/starter-kit/CAPTIONS.md).
5. Reel demo app: `REEL_GARAGE_USER=demo npm run reel`.
6. Aggiorna [social/content-log.md](../../social/content-log.md).

## Workflow «Gestione ongoing» (su richiesta)

1. Leggi content-log — ultimi 3 pilastri.
2. Scegli pilastro da [pilastri-contenuto.md](../social-motogarage/pilastri-contenuto.md).
3. Genera 1 immagine minimo + caption + hashtag + formato (Story/Reel/Feed).
4. Suggerisci 1 azione engagement (domanda in caption, sondaggio story, CTA link bio).
5. Logga in content-log.

## Workflow «Settimana marketing»

Leggi [playbook.md](playbook.md) e proponi piano 7 giorni (1 contenuto/giorno max) — **solo quando l'utente chiede piano settimanale**, non auto.

## Tono brand

- Diretto, appassionato moto, zero corporate.
- Benefici concreti: garage 3D, GPS, card 9:16, community.
- Italiano; emoji max 2–3 per post.

## Metriche da monitorare (manuale)

- Link in bio click (Instagram Insights)
- Registrazioni `/accedi` (analytics app quando disponibile)
- Salvataggi / condivisioni post
- Reach Reel vs Story

## Cosa NON fare

- Non schedulare post automatici.
- Non usare dati personali del team.
- Non promettere feature non in produzione.

## Skill collegate

- `@social-motogarage` — generazione contenuti singoli
- `@create-skill` — estendere questo playbook se serve nuovo canale (TikTok, YouTube Shorts)
