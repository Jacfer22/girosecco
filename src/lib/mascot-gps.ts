import type { Punto } from '@/lib/geo';

export type IdMascotGps = 'rosso' | 'blu' | 'nero';

export interface MascotGps {
  id: IdMascotGps;
  nome: string;
  ruolo: string;
  immagine: string;
  accent: string;
  /** Rotazione PNG di default (gradi) — il marker somma la direzione di marcia */
  rotazioneBase: number;
}

/** Mascotte GPS disponibili oggi */
export const MASCOTTE_GPS: MascotGps[] = [
  {
    id: 'rosso',
    nome: 'Rosso',
    ruolo: 'Sport · traccia e curve',
    immagine: '/mascot/rosso-sport.png',
    accent: '#ED2100',
    rotazioneBase: -90,
  },
  {
    id: 'blu',
    nome: 'Blu',
    ruolo: 'Adventure · itinerari',
    immagine: '/mascot/blu-adventure.png',
    accent: '#2B8CDE',
    rotazioneBase: 90,
  },
  {
    id: 'nero',
    nome: 'Nero',
    ruolo: 'Cruiser · garage',
    immagine: '/mascot/nero-cruiser.png',
    accent: '#C8C4BC',
    rotazioneBase: -90,
  },
];

/** Anteprima moto sbloccabili in futuro (solo teaser UI) */
export const MOTO_GPS_FUTURE = [
  { id: 'panigale', nome: 'Panigale', emoji: '🏁' },
  { id: 'africa', nome: 'Adventure', emoji: '🏔️' },
  { id: 'bobber', nome: 'Bobber', emoji: '🛣️' },
  { id: 'scrambler', nome: 'Scrambler', emoji: '🌄' },
  { id: 'naked', nome: 'Naked', emoji: '⚡' },
  { id: 'touring', nome: 'Touring', emoji: '🧭' },
] as const;

const CHIAVE_STORAGE = 'motogarage-mascot-gps';

export function mascotGps(id: IdMascotGps): MascotGps {
  return MASCOTTE_GPS.find((m) => m.id === id) ?? MASCOTTE_GPS[0];
}

export function leggiMascotGps(): IdMascotGps {
  if (typeof window === 'undefined') return 'rosso';
  const raw = localStorage.getItem(CHIAVE_STORAGE);
  if (raw === 'rosso' || raw === 'blu' || raw === 'nero') return raw;
  return 'rosso';
}

export function salvaMascotGps(id: IdMascotGps): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHIAVE_STORAGE, id);
}

/** Bearing geografico in gradi (0 = nord, senso orario) */
export function direzioneGradi(da: Punto, a: Punto): number {
  const lat1 = (da.lat * Math.PI) / 180;
  const lat2 = (a.lat * Math.PI) / 180;
  const dLng = ((a.lng - da.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function rotazioneMarkerMascot(punti: Punto[], mascot: MascotGps): number {
  if (punti.length >= 2) {
    const da = punti[punti.length - 2];
    const a = punti[punti.length - 1];
    if (Math.hypot(a.lat - da.lat, a.lng - da.lng) > 1e-7) {
      return direzioneGradi(da, a) + mascot.rotazioneBase;
    }
  }
  return mascot.rotazioneBase;
}

/** Rotazione durante navigazione (GPS o verso posizione corrente) */
export function rotazioneMascotNav(
  percorsoGps: Punto[] | undefined,
  posizione: Punto | null,
  mascot: MascotGps,
): number {
  if (percorsoGps && percorsoGps.length >= 2) {
    return rotazioneMarkerMascot(percorsoGps, mascot);
  }
  if (posizione && percorsoGps && percorsoGps.length === 1) {
    return rotazioneMarkerMascot([percorsoGps[0], posizione], mascot);
  }
  return mascot.rotazioneBase;
}

export function htmlMarkerMascotGps(mascot: MascotGps, rotazioneGradi = mascot.rotazioneBase): string {
  return `<div class="marker-mascot-gps" style="--mascot-accent:${mascot.accent};--mascot-rot:${rotazioneGradi}deg" aria-hidden="true">
    <img src="${mascot.immagine}" alt="" draggable="false" />
  </div>`;
}

export const DIMENSIONI_MARKER_MASCOT = {
  iconSize: [52, 52] as [number, number],
  iconAnchor: [26, 44] as [number, number],
};
