import Link from 'next/link';
import { getItinerari } from '@/lib/supabase';
import LandingHero from '@/components/LandingHero';
import HomeRedirectLoggato from '@/components/HomeRedirectLoggato';
import SezioneCardEsempio from '@/components/SezioneCardEsempio';
import SezioneComeFunziona from '@/components/SezioneComeFunziona';
import SezionePiattaformaGarage from '@/components/SezionePiattaformaGarage';
import Reveal from '@/components/Reveal';

export const revalidate = 3600;

export default async function HomePage() {
  const itinerari = await getItinerari();
  const reali = itinerari.filter((i) => !i.is_placeholder);

  return (
    <div>
      <HomeRedirectLoggato />
      <LandingHero itinerariCount={reali.length} />

      <div className="strada-viva strada-viva-animata" aria-hidden="true" />

      <SezioneCardEsempio />

      <div className="strada-viva strada-viva-animata" aria-hidden="true" />

      <SezionePiattaformaGarage />

      <div className="strada-viva strada-viva-animata" aria-hidden="true" />

      <SezioneComeFunziona />

      <div className="strada-viva strada-viva-animata" aria-hidden="true" />

      <section className="tuning-cta-finale">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:py-16">
          <Reveal>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-5xl">
              Pronto a partire?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-cemento/65 sm:text-base">
              Registrati gratis, sblocca gli itinerari e inizia a costruire il tuo garage digitale.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/accedi#registrati"
                className="tap rounded-app bg-brand px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-colors hover:bg-brand-chiaro"
              >
                Crea account gratuito
              </Link>
              <Link
                href="/itinerari"
                className="tap rounded-app border border-white/15 px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wide text-cemento/75 transition-colors hover:border-white/30 hover:text-white"
              >
                Esplora itinerari
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
