'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Tappa } from '@/lib/types';
import { Punto } from '@/lib/geo';
import {
  creaIconaMascotLeaflet,
  mascotGps,
  rotazioneMascotNav,
  type IdMascotGps,
} from '@/lib/mascot-gps';
import { useMascotGpsId } from '@/hooks/use-mascot-gps';

const PIXEL_TRASPARENTE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

interface Props {
  tappe: Tappa[];
  tracciato: [number, number][];
  posizione: Punto | null;
  segui: boolean;
  mascotId?: IdMascotGps;
}

export default function MappaNavigazione({ tappe, tracciato, posizione, segui, mascotId: mascotIdProp }: Props) {
  const { mascotId: mascotIdHook } = useMascotGpsId();
  const mascotId = mascotIdProp ?? mascotIdHook;
  const contenitore = useRef<HTMLDivElement>(null);
  const mappaRef = useRef<unknown>(null);
  const markerPosRef = useRef<unknown>(null);
  const ultimaIconaRef = useRef('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletRef = useRef<any>(null);

  const percorsoNav: Punto[] = useMemo(
    () =>
      tracciato && tracciato.length > 1
        ? tracciato.map(([lat, lng]) => ({ lat, lng }))
        : tappe.map((t) => ({ lat: t.lat, lng: t.lng })),
    [tracciato, tappe],
  );

  useEffect(() => {
    let attivo = true;

    async function init() {
      if (!contenitore.current || mappaRef.current) return;
      const L = (await import('leaflet')).default;
      if (!attivo || !contenitore.current) return;
      leafletRef.current = L;

      const mappa = L.map(contenitore.current, { scrollWheelZoom: false });
      mappaRef.current = mappa;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
        errorTileUrl: PIXEL_TRASPARENTE,
      }).addTo(mappa);

      const lineaPunti =
        tracciato && tracciato.length > 1
          ? tracciato
          : tappe.map((t) => [t.lat, t.lng] as [number, number]);

      if (lineaPunti.length > 0) {
        L.polyline(lineaPunti, {
          color: '#28282B',
          weight: 4,
          opacity: 0.85,
          lineJoin: 'round',
        }).addTo(mappa);

        tappe.forEach((t) => {
          const icona = L.divIcon({
            className: '',
            html: `<div class="marker-tappa">${t.ordine}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          L.marker([t.lat, t.lng], { icon: icona })
            .addTo(mappa)
            .bindTooltip(t.nome, {
              permanent: true,
              direction: 'top',
              offset: [0, -14],
              className: 'etichetta-tappa',
            });
        });

        const bounds = L.latLngBounds(lineaPunti as [number, number][]);
        mappa.fitBounds(bounds, { padding: [30, 30] });
      }

      setTimeout(() => mappa.invalidateSize(), 200);
    }

    init();

    return () => {
      attivo = false;
      if (mappaRef.current) {
        (mappaRef.current as { remove: () => void }).remove();
        mappaRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const mappa = mappaRef.current as {
      setView: (latlng: [number, number], zoom?: number, opts?: object) => void;
      getZoom: () => number;
    } | null;
    if (!L || !mappa || !posizione) return;

    const latlng: [number, number] = [posizione.lat, posizione.lng];
    const mascot = mascotGps(mascotId);
    const rot = rotazioneMascotNav(undefined, posizione, mascot, percorsoNav);
    const chiaveIcona = `${mascotId}-${Math.round(rot / 6)}`;

    if (!markerPosRef.current) {
      markerPosRef.current = L.marker(latlng, {
        icon: creaIconaMascotLeaflet(L, mascot, rot),
        zIndexOffset: 1000,
      }).addTo(mappa);
      ultimaIconaRef.current = chiaveIcona;
    } else {
      const m = markerPosRef.current as {
        setLatLng: (l: [number, number]) => void;
        setIcon: (i: unknown) => void;
      };
      m.setLatLng(latlng);
      if (chiaveIcona !== ultimaIconaRef.current) {
        ultimaIconaRef.current = chiaveIcona;
        m.setIcon(creaIconaMascotLeaflet(L, mascot, rot));
      }
    }

    if (segui) {
      mappa.setView(latlng, Math.max(mappa.getZoom(), 15), { animate: true });
    }
  }, [posizione, segui, mascotId, percorsoNav]);

  return (
    <div
      ref={contenitore}
      className="mappa-itinerario h-80 w-full border-2 border-asfalto sm:h-[28rem]"
      role="img"
      aria-label="Mappa di navigazione con il percorso, le tappe e la tua posizione"
    />
  );
}
