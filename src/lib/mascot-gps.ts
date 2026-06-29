import type { Punto } from '@/lib/geo';

export type IdMascotGps = 'rosso' | 'blu' | 'nero';

export interface MascotGps {
  id: IdMascotGps;
  nome: string;
  ruolo: string;
  /** PNG scontornato per marker mappa */
  immagine: string;
  accent: string;
  /** Offset CSS: asset guardano verso destra (est) */
  rotazioneBase: number;
}

export const MASCOTTE_GPS: MascotGps[] = [
  {
    id: 'rosso',
    nome: 'Rosso',
    ruolo: 'Sport',
    immagine: '/mascot/rosso-sport-marker.png',
    accent: '#ED2100',
    rotazioneBase: -90,
  },
  {
    id: 'blu',
    nome: 'Blu',
    ruolo: 'Adventure',
    immagine: '/mascot/blu-adventure-marker.png',
    accent: '#2B8CDE',
    rotazioneBase: -90,
  },
  {
    id: 'nero',
    nome: 'Nero',
    ruolo: 'Cruiser',
    immagine: '/mascot/nero-cruiser-marker.png',
    accent: '#C8C4BC',
    rotazioneBase: -90,
  },
];

export const MOTO_GPS_FUTURE = [
  { id: 'panigale', nome: 'Panigale', emoji: '🏁' },
  { id: 'africa', nome: 'Adventure', emoji: '🏔️' },
  { id: 'bobber', nome: 'Bobber', emoji: '🛣️' },
  { id: 'scrambler', nome: 'Scrambler', emoji: '🌄' },
  { id: 'naked', nome: 'Naked', emoji: '⚡' },
  { id: 'touring', nome: 'Touring', emoji: '🧭' },
] as const;

const CHIAVE_STORAGE = 'motogarage-mascot-gps';

export const MASCOT_MARKER_PX = 52;

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

export function direzioneGradi(da: Punto, a: Punto): number {
  const lat1 = (da.lat * Math.PI) / 180;
  const lat2 = (a.lat * Math.PI) / 180;
  const dLng = ((a.lng - da.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function distanzaQuadro(a: Punto, b: Punto): number {
  const dlat = a.lat - b.lat;
  const dlng = a.lng - b.lng;
  return dlat * dlat + dlng * dlng;
}

export function direzioneSuPercorso(posizione: Punto, percorso: Punto[]): number | null {
  if (percorso.length < 2) return null;

  let idx = 0;
  let min = Infinity;
  for (let i = 0; i < percorso.length; i += 1) {
    const d = distanzaQuadro(posizione, percorso[i]);
    if (d < min) {
      min = d;
      idx = i;
    }
  }

  const da = percorso[Math.min(idx, percorso.length - 2)];
  const a = percorso[Math.min(idx + 1, percorso.length - 1)];
  if (Math.hypot(a.lat - da.lat, a.lng - da.lng) < 1e-9) return null;
  return direzioneGradi(da, a);
}

export function rotazioneDaBearing(bearing: number, mascot: MascotGps): number {
  return bearing + mascot.rotazioneBase;
}

export function rotazioneMarkerMascot(punti: Punto[], mascot: MascotGps): number {
  if (punti.length >= 2) {
    const da = punti[punti.length - 2];
    const a = punti[punti.length - 1];
    if (Math.hypot(a.lat - da.lat, a.lng - da.lng) > 1e-7) {
      return rotazioneDaBearing(direzioneGradi(da, a), mascot);
    }
  }
  return mascot.rotazioneBase;
}

export function rotazioneMascotNav(
  percorsoGps: Punto[] | undefined,
  posizione: Punto | null,
  mascot: MascotGps,
  percorsoNav?: Punto[],
  destinazione?: Punto | null,
): number {
  if (percorsoGps && percorsoGps.length >= 2) {
    return rotazioneMarkerMascot(percorsoGps, mascot);
  }
  if (posizione && percorsoGps && percorsoGps.length === 1) {
    return rotazioneMarkerMascot([percorsoGps[0], posizione], mascot);
  }
  if (posizione && percorsoNav && percorsoNav.length >= 2) {
    const bearing = direzioneSuPercorso(posizione, percorsoNav);
    if (bearing != null) return rotazioneDaBearing(bearing, mascot);
  }
  if (posizione && destinazione) {
    return rotazioneDaBearing(direzioneGradi(posizione, destinazione), mascot);
  }
  return mascot.rotazioneBase;
}

export function htmlMarkerMascotGps(
  imageSrc: string,
  rotazioneGradi: number,
  accent: string,
): string {
  const px = MASCOT_MARKER_PX;
  return `<div class="marker-mascot-gps" style="width:${px}px;height:${px}px;overflow:visible;display:flex;align-items:center;justify-content:center;--mascot-accent:${accent}">
    <img src="${imageSrc}" alt="" draggable="false" width="${px}" height="${px}" style="width:${px}px;height:${px}px;max-width:${px}px;max-height:${px}px;object-fit:contain;display:block;transform:rotate(${rotazioneGradi}deg);transform-origin:center center" />
  </div>`;
}

export const DIMENSIONI_MARKER_MASCOT = {
  iconSize: [56, 56] as [number, number],
  iconAnchor: [28, 28] as [number, number],
};

export function creaIconaMascotLeaflet(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  L: any,
  mascot: MascotGps,
  rotazioneGradi: number,
  imageSrc?: string,
) {
  return L.divIcon({
    className: 'marker-mascot-wrap',
    html: htmlMarkerMascotGps(imageSrc ?? mascot.immagine, rotazioneGradi, mascot.accent),
    iconSize: DIMENSIONI_MARKER_MASCOT.iconSize,
    iconAnchor: DIMENSIONI_MARKER_MASCOT.iconAnchor,
  });
}
