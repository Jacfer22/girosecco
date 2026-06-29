# Ideogram 4 — asset Instagram (solo tu, da Cursor)

Generazione **locale** di immagini HD e reel per pubblicità Instagram. **Non** è nell'app MotoGarage.

Space: [ideogram-ai/ideogram4](https://huggingface.co/spaces/ideogram-ai/ideogram4)

## Perché browser e non API?

Sul sito HF funziona perché sei **loggato**. Lo script API diretto usa una quota IP anonima (2 min/giorno) — da qui la quota “finisce” anche se sul browser no.

**Soluzione:** Playwright apre lo space con **la tua sessione HF** salvata in locale (come quando usi Chrome loggato).

## Setup (una volta)

```bash
npm run social:ideogram:login
```

Si apre Chrome → accedi a Hugging Face → chiudi la finestra. Sessione salvata in `social/ideogram/.browser-profile/` (gitignored).

## Generare in alta definizione

Default browser: **1152×2048** (9:16 nativo). Con `--hd` forza **Quality · 48 steps**.

```bash
# Harley strada-notte (prompt salvato)



# Prompt libero
npm run social:ideogram -- --prompt "moto sportiva al tramonto, cinematic, no text" --hd --branded

# Tutti i preset marketing
npm run social:ideogram -- --preset all --hd --branded
```

## Output


| File                              | Descrizione                         |
| --------------------------------- | ----------------------------------- |
| `out/raw/*.webp`                  | Immagine Ideogram piena risoluzione |
| `out/branded/*-branded.png`       | Post 1080×1920 con logo             |
| `out/reel-ideogram-slideshow.mp4` | Reel slideshow (con `--video`)      |


## Opzioni utili


| Flag             | Effetto                             |
| ---------------- | ----------------------------------- |
| `--hd`           | 1152×2048 + Quality                 |
| `--headed`       | Browser visibile (debug)            |
| `--api`          | API Gradio (sconsigliato, quota IP) |
| `--list-presets` | Elenco preset MotoGarage            |


## Video Instagram

Ideogram genera **solo immagini**. Per reel:

- `--video` → slideshow MP4 dalle immagini branded
- `npm run social:tour-video` → reel mascotte tour app
- `npm run reel` → screen recording app in frame iPhone

## Da Cursor

Chiedi all'agente: *“genera il preset garage in HD con Ideogram”* — lancerà lo script con browser.