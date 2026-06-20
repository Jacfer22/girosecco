'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import Reveal from './Reveal';
import CardDemoAnteprima from './CardDemoAnteprima';

const PASSI = [
  {
    numero: '01',
    titolo: 'Registrati gratis',
    desc: 'Profilo, giri nel cloud e garage digitale — tutto sincronizzato su ogni dispositivo.',
  },
  {
    numero: '02',
    titolo: 'Traccia un giro',
    desc: 'Avvia il GPS, registra km e curve reali. Al termine ottieni statistiche e la card social.',
  },
  {
    numero: '03',
    titolo: 'Condividi e cresci',
    desc: 'Pubblica in community, crea l\'avatar 3D della moto e scala la classifica km.',
  },
];

export default function SezioneComeFunziona() {
  const { user, loading } = useAuth();

  if (loading || user) return null;

  return (
    <section className="border-y border-asfalto/8 bg-white dark:bg-carbone">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-asfalto/40">
                Come funziona
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Tre passi e sei in sella
              </h2>
            </Reveal>

            <div className="mt-8 space-y-4">
              {PASSI.map((passo, i) => (
                <Reveal key={passo.numero} delay={i * 60}>
                  <div className="flex gap-4 rounded-app-lg border border-asfalto/10 p-4 dark:border-white/10">
                    <p className="font-display text-3xl font-black text-brand">{passo.numero}</p>
                    <div>
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight">
                        {passo.titolo}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-asfalto/65 dark:text-cemento/65">
                        {passo.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <Link
                href="/accedi#registrati"
                className="tap btn-primary mt-8 inline-flex"
              >
                Registrati e traccia il primo giro
              </Link>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-asfalto/40">
                Esempio card social
              </p>
              <p className="mt-1 text-sm text-asfalto/60 dark:text-cemento/60">
                Generata automaticamente a fine giro — pronta per Instagram e TikTok.
              </p>
              <CardDemoAnteprima className="mt-6" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
