# PUBLISH PACK — MotoGarage Tour Instagram
> Generato per: Instagram Reels + Post statico
> Assets: `reel-instagram.html` · `cover-instagram.html`

---

## 📱 REEL — Caption principale

```
🏍️ Ti presentiamo Rosso, Blu e Nero.

Tre moto. Tre caratteri. Un unico tour dell'app che stavi aspettando.

👉 Hub personale
👉 GPS Traccia Giro in tempo reale
👉 Garage 3D della tua moto
👉 Itinerari e Community

Tutto gratis. Tutto per te.
Sei un motociclista — questa è la tua casa digitale.

🔗 girosecco.vercel.app
```

---

## 📌 HASHTAG SET — Reel (30 tag)

```
#motogarage #moto #motociclismo #motociclista #ducati #harleydavidson
#honda #bmwmotorrad #kawasaki #yamaha #appmoto #gpstracking #garage3d
#motoritalia #motobike #bikerlife #bikersofinstagram #mototour #itinerari
#communityitaliana #motostyle #appgratuita #motovlog #tracciagps
#motogp #superbike #ducatistagram #enduro #adventure #motociclisti
```

---

## 📌 HASHTAG SET — Versione corta (15 tag, per Stories)

```
#motogarage #moto #motociclismo #gpstracking #garage3d
#motoritalia #appmoto #motobike #bikerlife #itinerari
#communityitaliana #appgratuita #motovlog #motociclista #ducati
```

---

## 🖼️ POST STATICO (Cover) — Caption

```
L'app che mancava è qui. 🏍️

Rosso traccia i giri. Blu pianifica gli itinerari. Nero costruisce il tuo Garage 3D.
E tu? Guardi il Reel e scarichi MotoGarage.

✅ GPS in tempo reale
✅ Garage 3D personalizzato
✅ Itinerari per motociclisti
✅ Community italiana

👇 Link in bio — girosecco.vercel.app
```

---

## 📖 STORIES — Sequenza 3 slide

### Slide 1 — Hook
```
Sai cos'hanno in comune
Rosso, Blu e Nero? 🤔
[usa immagine trio mascot]
```

### Slide 2 — Reveal
```
Usano tutti MotoGarage 🏁
GPS · Garage 3D · Community
[usa screenshot app]
```

### Slide 3 — CTA
```
Tu ancora no? 👀
↓ Swipe up ↓
girosecco.vercel.app
[usa cover rossa con logo]
```

---

## 🎬 REEL — Note di pubblicazione

| Campo | Valore |
|-------|--------|
| **Formato** | 9:16 · 1080×1920px |
| **Durata** | 30 secondi |
| **Cover frame** | 3s (logo slam) |
| **Sottotitoli** | Aggiungi via Instagram (auto-generated) |
| **Ora consigliata** | Mer/Gio/Ven 18:00–20:00 |
| **Prima pubblicazione** | Reel · poi riusa come Post |

---

## 🎞️ COME ESPORTARE IL REEL IN MP4

### Opzione A — Puppeteer (automatico)
```bash
npm install puppeteer
node scripts/capture-reel.mjs
```

### Opzione B — Chrome DevTools (manuale)
1. Apri `reel-instagram.html` in Chrome (zoom 100%)
2. DevTools → Performance → Record
3. Aspetta 30s → Stop → Export frames
4. Usa ffmpeg per assemblare i frame:

```bash
ffmpeg -framerate 30 -i frame_%04d.png \
  -c:v libx264 -crf 20 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  reel-motogarage-finale.mp4
```

### Opzione C — Screen recorder
1. Apri `reel-instagram.html` in Chrome a 1080px di larghezza
2. Usa OBS Studio o Loom per registrare il tab
3. Taglia a esattamente 30s

---

## 📁 FILE DELIVERABLE

| File | Uso | Dimensione target |
|------|-----|-------------------|
| `reel-instagram.html` | Reel 30s animato | → MP4 < 50MB |
| `cover-instagram.html` | Cover post statico | → JPG 1080×1080 |
| `PUBLISH-PACK.md` | Questo file | — |

---

## ✅ CHECKLIST PRE-PUBBLICAZIONE

- [ ] Reel esportato in MP4
- [ ] Cover esportata in JPG (screenshot browser a 1080px)
- [ ] Caption copiata con hashtag
- [ ] Link in bio aggiornato: `girosecco.vercel.app`
- [ ] Orario programmato (Mer-Ven 18-20)
- [ ] Stories programmate il giorno dopo
- [ ] Rispondi ai commenti nelle prime 2h (boost algoritmo)
