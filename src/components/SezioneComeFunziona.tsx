'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import Reveal from './Reveal';

const PASSI = [
  {
    numero: '01',
    titolo: 'Registrati gratis',
    desc: 'Crea il profilo in pochi secondi e accedi a itinerari, community e garage digitale.',
  },
  {
    numero: '02',
    titolo: 'Traccia un giro',
    desc: 'Avvia il GPS, registra km e curve reali. Al termine ottieni statistiche e la card social.',
  },
  {
    numero: '03',
    titolo: 'Garage e community',
    desc: 'Crea l’avatar 3D della moto, personalizza il garage e condividi giri nel feed.',
  },
];

export default function SezioneComeFunziona() {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return (
    <section className="border-y border-asfalto/8 bg-white dark:bg-carbone">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-asfalto/40">
            Come funziona
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Tre passi e sei in sella
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PASSI.map((passo, i) => (
            <Reveal key={passo.numero} delay={i * 60}>
              <div className="rounded-app-lg border-2 border-asfalto/10 p-5 dark:border-white/10">
                <p className="font-display text-4xl font-black text-brand">{passo.numero}</p>
                <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight">
                  {passo.titolo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-asfalto/65 dark:text-cemento/65">
                  {passo.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-asfalto/40">
              Esempio card social
            </p>
            <p className="mt-1 text-sm text-asfalto/60 dark:text-cemento/60">
              Così appare la card del tuo giro su Instagram — generata automaticamente da MotoGarage.
            </p>

            <div className="mt-6 mx-auto max-w-[320px]">
              <div className="rounded-[24px] border border-asfalto/15 bg-asfalto p-3 shadow-app-lg dark:border-white/10">
                <div className="flex items-center gap-2 px-2 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    MG
                  </div>
                  <span className="font-mono text-xs font-bold text-cemento">motogarage</span>
                </div>

                <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[#0a0b0e]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(209,25,25,0.25),transparent_45%),linear-gradient(180deg,#12141a,#08090b)]" />
                  <svg
                    viewBox="0 0 400 500"
                    className="absolute inset-0 h-full w-full opacity-90"
                    aria-hidden="true"
                  >
                    <path
                      d="M 60 380 Q 120 280 180 320 T 340 180"
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
                    <p className="font-display text-lg font-black uppercase leading-tight text-white">
                      Passo dello Stelvio
                    </p>
                    <div className="mt-3 flex gap-4 font-mono text-[10px] uppercase tracking-wide text-cemento/80">
                      <span><strong className="text-white">87</strong> km</span>
                      <span><strong className="text-white">2h 14m</strong></span>
                      <span><strong className="text-white">42</strong> curve</span>
                    </div>
                    <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-brand">
                      Moto Garage
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex gap-3 px-2 py-1 text-cemento/50">
                  <span aria-hidden="true">♥</span>
                  <span aria-hidden="true">💬</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/accedi#registrati"
                className="tap rounded-app bg-brand px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-colors hover:bg-brand-chiaro"
              >
                Registrati e traccia il primo giro
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
