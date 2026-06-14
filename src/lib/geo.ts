export interface Punto {
  lat: number;
  lng: number;
}

/** Distanza in metri tra due punti GPS (formula haversine). */
export function distanzaMetri(a: Punto, b: Punto): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Somma le distanze tra punti consecutivi di un tracciato, in metri. */
export function lunghezzaTracciato(punti: Punto[]): number {
  let totale = 0;
  for (let i = 1; i < punti.length; i++) {
    totale += distanzaMetri(punti[i - 1], punti[i]);
  }
  return totale;
}

/** Formatta una durata in secondi come "m:ss" o "h:mm:ss". */
export function formattaDurata(secondi: number): string {
  const tot = Math.max(0, Math.floor(secondi));
  const h = Math.floor(tot / 3600);
  const m = Math.floor((tot % 3600) / 60);
  const s = tot % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Formatta una distanza in metri come km con una cifra decimale. */
export function formattaKm(metri: number): string {
  return (metri / 1000).toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Indice del punto del tracciato più vicino a una posizione. */
export function indicePuntoPiuVicino(tracciato: Punto[], pos: Punto): number {
  let migliore = 0;
  let distanzaMin = Infinity;
  tracciato.forEach((p, i) => {
    const d = distanzaMetri(p, pos);
    if (d < distanzaMin) {
      distanzaMin = d;
      migliore = i;
    }
  });
  return migliore;
}

/** Distanza (in metri) rimanente sul tracciato a partire da un indice fino alla fine. */
export function distanzaRimanente(tracciato: Punto[], daIndice: number): number {
  let totale = 0;
  for (let i = daIndice; i < tracciato.length - 1; i++) {
    totale += distanzaMetri(tracciato[i], tracciato[i + 1]);
  }
  return totale;
}

/** Converte una velocità in m/s (come da GPS) in km/h. */
export function msAKmh(ms: number | null | undefined): number | null {
  if (ms === null || ms === undefined || Number.isNaN(ms)) return null;
  return ms * 3.6;
}
