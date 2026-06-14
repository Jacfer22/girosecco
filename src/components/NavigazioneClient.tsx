'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  distanzaMetri,
  distanzaRimanente,
  formattaKm,
  indicePuntoPiuVicino,
  msAKmh,
  Punto,
} from '@/lib/geo';
import { Tappa } from '@/lib/types';

const MappaNavigazione = dynamic(() => import('./MappaNavigazione'), { ssr: false });

const SOGLIA_ARRIVO_TAPPA_M = 150;

interface Props {
  titolo: string;
  tappe: Tappa[];
  tracciato: [number, number][];
}

export default function NavigazioneClient({ titolo, tappe, tracciato }: Props) {
  const [attiva, setAttiva] = useState(false);
  const [posizione, setPosizione] = useState<Punto | null>(null);
  const [velocitaKmh, setVelocitaKmh] = useState<number | null>(null);
  const [segui, setSegui] = useState(true);
  const [errore, setErrore] = useState<string | null>(null);
  const [tappaIndice, setTappaIndice] = useState(0);

  const watchIdRef = useRef<number | null>(null);

  const tappeOrdinate = [...tappe].sort((a, b) => a.ordine - b.ordine);
  const tappaSuccessiva = tappeOrdinate[tappaIndice] ?? null;
  const fineTracciato = tracciato.length > 1;

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  function avvia() {
    setErrore(null);
    if (!('geolocation' in navigator)) {
      setErrore('Il tuo browser non supporta la geolocalizzazione.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const nuova: Punto = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosizione(nuova);
        setVelocitaKmh(msAKmh(pos.coords.speed));

        if (tappaSuccessiva) {
          const d = distanzaMetri(nuova, { lat: tappaSuccessiva.lat, lng: tappaSuccessiva.lng });
          if (d < SOGLIA_ARRIVO_TAPPA_M) {
            setTappaIndice((i) => Math.min(i + 1, tappeOrdinate.length - 1));
          }
        }
      },
      (err) => {
        setErrore(
          err.code === err.PERMISSION_DENIED
            ? 'Permesso posizione negato. Attivalo nelle impostazioni del browser per usare la navigazione.'
            : 'Non riesco a leggere la posizione GPS. Controlla di avere il GPS attivo.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );

    setAttiva(true);
  }

  function ferma() {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setAttiva(false);
  }

  // Calcoli "info stradali"
  let distanzaProssimaTappa: number | null = null;
  let distanzaTotaleRimanente: number | null = null;

  if (posizione && tappaSuccessiva) {
    distanzaProssimaTappa = distanzaMetri(posizione, {
      lat: tappaSuccessiva.lat,
      lng: tappaSuccessiva.lng,
    });
  }

  if (posizione && fineTracciato) {
    const idx = indicePuntoPiuVicino(
      tracciato.map(([lat, lng]) => ({ lat, lng })),
      posizione
    );
    distanzaTotaleRimanente = distanzaRimanente(
      tracciato.map(([lat, lng]) => ({ lat, lng })),
      idx
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Naviga</h2>
        {attiva && (
          <button
            type="button"
            onClick={() => setSegui((s) => !s)}
            className={`border-2 border-asfalto px-3 py-1.5 font-mono text-xs font-medium uppercase ${
              segui ? 'bg-segnale text-asfalto' : 'bg-white text-asfalto'
            }`}
          >
            {segui ? 'Segui: ON' : 'Segui: OFF'}
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-asfalto/60">
        Mostra il percorso, le tappe e la tua posizione in tempo reale. Non è una
        navigazione vocale turn-by-turn: per le indicazioni dettagliate usa il GPX
        sul tuo navigatore.
      </p>

      {errore && (
        <p className="mt-3 border-2 border-red-700 bg-red-50 p-3 text-sm text-red-900">{errore}</p>
      )}

      <div className="mt-4">
        <MappaNavigazione tappe={tappeOrdinate} tracciato={tracciato} posizione={posizione} segui={segui} />
      </div>

      {/* Info stradali */}
      {attiva && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="border-2 border-asfalto bg-white p-3 text-center">
            <p className="font-mono text-xs uppercase text-asfalto/50">Velocità</p>
            <p className="font-display text-2xl font-bold">
              {velocitaKmh !== null ? `${velocitaKmh.toFixed(0)} km/h` : '—'}
            </p>
          </div>
          <div className="border-2 border-asfalto bg-white p-3 text-center">
            <p className="font-mono text-xs uppercase text-asfalto/50">Prossima tappa</p>
            <p className="truncate font-display text-lg font-bold uppercase">
              {tappaSuccessiva ? tappaSuccessiva.nome : 'Arrivo'}
            </p>
          </div>
          <div className="border-2 border-asfalto bg-white p-3 text-center">
            <p className="font-mono text-xs uppercase text-asfalto/50">Dista</p>
            <p className="font-display text-2xl font-bold">
              {distanzaProssimaTappa !== null ? `${formattaKm(distanzaProssimaTappa)} km` : '—'}
            </p>
          </div>
          <div className="border-2 border-asfalto bg-white p-3 text-center">
            <p className="font-mono text-xs uppercase text-asfalto/50">Rimanenti</p>
            <p className="font-display text-2xl font-bold">
              {distanzaTotaleRimanente !== null ? `${formattaKm(distanzaTotaleRimanente)} km` : '—'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        {!attiva ? (
          <button
            type="button"
            onClick={avvia}
            className="bg-segnale px-6 py-3 font-mono font-medium uppercase text-asfalto hover:bg-white"
          >
            Avvia navigazione
          </button>
        ) : (
          <button
            type="button"
            onClick={ferma}
            className="border-2 border-asfalto px-6 py-3 font-mono font-medium uppercase hover:bg-asfalto hover:text-cemento"
          >
            Ferma
          </button>
        )}
        <Link
          href="/traccia"
          className="border-2 border-asfalto px-6 py-3 font-mono font-medium uppercase hover:bg-asfalto hover:text-cemento"
        >
          Traccia questo giro →
        </Link>
      </div>

      <p className="mt-2 font-mono text-xs text-asfalto/40">{titolo}</p>
    </section>
  );
}
