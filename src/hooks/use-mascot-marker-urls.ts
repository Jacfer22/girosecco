'use client';

import { useEffect, useState } from 'react';
import { MASCOTTE_GPS, type IdMascotGps } from '@/lib/mascot-gps';
import { ritagliaSfondoNeroMascot } from '@/lib/mascot-trasparenza';

export type UrlMascotMap = Partial<Record<IdMascotGps, string>>;

export function useMascotMarkerUrls(): { urls: UrlMascotMap; pronto: boolean } {
  const [urls, setUrls] = useState<UrlMascotMap>({});

  useEffect(() => {
    let attivo = true;
    (async () => {
      const entries = await Promise.all(
        MASCOTTE_GPS.map(async (m) => {
          const url = await ritagliaSfondoNeroMascot(m.immagine);
          return [m.id, url] as const;
        }),
      );
      if (attivo) setUrls(Object.fromEntries(entries) as UrlMascotMap);
    })().catch(() => {
      /* fallback: immagini originali */
    });
    return () => {
      attivo = false;
    };
  }, []);

  return { urls, pronto: Object.keys(urls).length === MASCOTTE_GPS.length };
}

export function urlMascotPerId(urls: UrlMascotMap, id: IdMascotGps, fallback: string): string {
  return urls[id] ?? fallback;
}
