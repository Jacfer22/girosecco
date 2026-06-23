---
name: social-motogarage
description: Genera contenuti social on-demand per MotoGarage (immagine 9:16, caption, hashtag). Usa con @marketing-motogarage per strategia completa. Trigger post Instagram, story, reel, immagine del giorno. Solo su richiesta — mai automatico. Mai nomi personali del team.
---

# Social MotoGarage — Agente contenuti

## Regola fondamentale

**Solo su richiesta dell'utente.** Non generare post in automatico, non schedulare, non eseguire cron.

**Privacy:** mai nomi, email o username personali in copy o asset. Solo brand MotoGarage e account demo.

Per strategia, calendario e lancio profilo → skill **`@marketing-motogarage`**.

## Obiettivo

Fornire **almeno 1 immagine pronta da pubblicare** (1080×1920, 9:16) + caption italiana + hashtag + suggerimento formato (Story / Reel / Feed).

## Workflow (ogni richiesta)

1. **Leggi** [social/content-log.md](../../social/content-log.md) — evita di ripetere lo stesso pilastro negli ultimi 3 post.
2. **Scegli pilastro** da [pilastri-contenuto.md](pilastri-contenuto.md) (rotazione: feature → tip → community → garage → traccia → itinerario → CTA).
3. **Genera immagine** con lo script brand (preferito):
   ```bash
   # Primo post / logo hero su nero HD
   npm run social:post -- --stile logo [--tagline "..."] [--pill "..."]

   # Post feature / tip
   npm run social:post -- --stile story --titolo "..." --sottotitolo "..." --tipo feature
   ```
   Output in `social/out/` (export 2× = 2160×3840 px). Logo embedded base64 — sempre visibile.
4. **Scrivi caption** (template sotto) + 8–12 hashtag mirati.
5. **Aggiorna** `social/content-log.md` con data, pilastro, file, caption breve.
6. **Consegna** all'utente: percorso immagine, caption copiabile, formato consigliato, link app (`NEXT_PUBLIC_SITE_URL` o dominio in layout).

## Script `npm run social:post`

| Flag | Obbligatorio | Esempio |
|------|--------------|---------|
| `--titolo` | sì | `"Traccia il tuo giro"` |
| `--sottotitolo` | no | `"GPS live + card condivisibile"` |
| `--pill` | no | `"Gratis · Provalo ora"` |
| `--tipo` | no | `feature` `tip` `garage` `traccia` `community` `itinerario` `cta` |

## Palette e stile (se usi GenerateImage)

- Sfondo: `#0F0B0A` → `#28282B` gradiente scuro
- Accento: `#ED2100` (brand rosso moto)
- Testo: `#F0F1F2`, titoli bold uppercase stile moto/asfalto
- Logo: riferimento visivo «MotoGarage moto garage digitale»
- Formato: **verticale 9:16**, niente bordi bianchi, look app premium dark

## Template caption

```markdown
[Hook 1 riga — domanda o beneficio]

[2–3 righe: cosa fa MotoGarage per il motociclista]

👉 Provalo gratis: [link app — vedi NEXT_PUBLIC_SITE_URL]

#motogarage #mototrip #motoviaggi #passionemoto #motorcyclelife #instamoto #viaggiinmoto #gpsmoto #garagedigitale #bikerlife
```

Adatta tono: diretto, appassionato, zero corporate. Emoji max 2–3.

## Varietà contenuti

Alterna formati suggeriti:
- **Story** (9:16 generato) — CTA swipe up / link in bio
- **Reel** — accenna a screen recording app (traccia, garage 3D)
- **Carosello** — solo se l'utente chiede più slide; altrimenti 1 immagine basta

## Profilo Instagram

Per setup bio, highlights e naming → leggi [instagram-profilo.md](instagram-profilo.md) e guida l'utente passo passo se chiede «crea profilo» / «bio Instagram».

## Cosa NON fare

- Non pubblicare su Instagram per conto dell'utente (no API posting).
- Non generare più post senza che l'utente li chieda.
- Non usare immagini stock generiche: sempre brand MotoGarage / asfalto / moto.
