# Kit Instagram Starter — MotoGarage

Generato con `npm run social:starter-kit`. Tutto pronto per caricare da telefono.

## Struttura

| Cartella | Contenuto | Uso Instagram |
|----------|-----------|---------------|
| `01-profile/` | Avatar 1080×1080 (logo) | **Foto profilo** |
| `02-logo/` | Post logo launch 9:16 | **Post #1** (pinna in alto) |
| `03-highlights/` | 5 copertine logo | **Evidenze** (App, Garage, Traccia, Itinerari, FAQ) |
| `04-tour/` | 9 JPG 9:16 con didascalie in foto | **Story** / carosello tour |
| `05-video/` | MP4 teaser + tour + reel mascotte | **Reel** |

## Tour virtuale (3 mascotte)

Rosso (sport), Blu (avventura), Nero (cruiser) guidano un tour in 9 step:

| File | Mascot | Feature |
|------|--------|---------|
| `01-benvenuto.jpg` | Rosso | Intro |
| `02-traccia.jpg` | Rosso | GPS |
| `03-itinerari.jpg` | Blu | Itinerari |
| `04-garage.jpg` | Nero | Garage 3D |
| `05-card.jpg` | Rosso | Card giro |
| `06-naviga.jpg` | Blu | Navigatore |
| `07-community.jpg` | Nero | Community |
| `08-registrati.jpg` | Blu | Registrazione gratis |
| `09-ciao.jpg` | Nero | Finale |

Le didascalie sono **scritte nella foto** (headline + speech bubble). Per Instagram copia anche da [CAPTIONS.md](CAPTIONS.md).

## Ordine di pubblicazione (giorno 1)

1. **Profilo** — `01-profile/avatar-1080.png`
2. **Bio** — vedi sotto
3. **Post #1** — `02-logo/logo-launch.png` (pinna se possibile)
4. **Story** — stessa immagine logo + link sticker
5. **Reel #1** — `05-video/teaser-logo-4s.mp4`
6. **Evidenze** — `03-highlights/*.png` come cover
7. **Story tour** — carica `04-tour/01-benvenuto.jpg` … `09-ciao.jpg` in sequenza (1/giorno o tutte in un giorno)
8. **Reel #2** — `05-video/tour-completo.mp4` (~36 sec)
9. **Reel mascotte** (opz.) — `05-video/reel-rosso.mp4`, `reel-blu.mp4`, `reel-nero.mp4`

## Bio (copia-incolla)

```
🏍️ Il garage digitale della tua moto
📍 Traccia · Naviga · Card social
🔗 Provalo gratis ↓
motogarage.info
```

## Username suggeriti

`@motogarage.app` · `@motogarage.info` · `@motogarage_official`

## Video demo app (screen recording reale)

Per un reel con screen recording dell'app:

```bash
REEL_GARAGE_USER=demo REEL_BASE_URL=https://motogarage.info npm run reel
```

Output: `public/reels/motogarage-instagram-reel-v2.mp4`

## Caption

Tutte in [CAPTIONS.md](CAPTIONS.md) — copia-incolla per ogni file.

## Privacy

Output JPG/MP4 **solo locale** (gitignored). Nessun nome personale — solo brand MotoGarage.

## Rigenerare

```bash
npm run social:starter-kit
# alias equivalente:
npm run social:tour
```
