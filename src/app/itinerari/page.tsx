import Link from 'next/link';
import { getItinerari, getItinerariConAvvisi } from '@/lib/supabase';
import { REGIONI } from '@/lib/regioni';
import Reveal from '@/components/Reveal';

export const revalidate = 3600;

export const metadata = {
  title: 'Itinerari moto in Italia',
  description:
    'Scopri gli itinerari moto regione per regione: mappe, tappe, GPX e strade verificate dai motociclisti italiani.',
};

interface RegioneCard {
  slug: string;
  nome: string;
  count: number;
  avvisi: number;
}

export default async function PaginaItinerari() {
  const [itinerari, idConAvvisi] = await Promise.all([
    getItinerari(),
    getItinerariConAvvisi(),
  ]);

  const conteggio = new Map<string, number>();
  const avvisi = new Map<string, number>();

  for (const item of itinerari) {
    for (const slug of item.regioni ?? []) {
      conteggio.set(slug, (conteggio.get(slug) ?? 0) + 1);
      if (idConAvvisi.has(item.id)) {
        avvisi.set(slug, (avvisi.get(slug) ?? 0) + 1);
      }
    }
  }

  const regioni: RegioneCard[] = REGIONI.map((r) => ({
    slug: r.slug,
    nome: r.nome,
    count: conteggio.get(r.slug) ?? 0,
    avvisi: avvisi.get(r.slug) ?? 0,
  })).sort((a, b) => {
    if (a.count > 0 && b.count === 0) return -1;
    if (a.count === 0 && b.count > 0) return 1;
    return a.nome.localeCompare(b.nome, 'it');
  });

  const totale = itinerari.filter((i) => !i.is_placeholder).length;
  const conItinerari = regioni.filter((r) => r.count > 0).length;

  return (
    <div>
      <section className="hero-asfalto border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-red-400">
              Italia · regione per regione
            </p>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl">
              Itinerari
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-cemento/65 sm:text-lg">
              Strade verificate, mappe interattive, tappe e GPX. Il primo giro di ogni
              regione è libero; gli altri si sbloccano con un account gratuito.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 flex flex-wrap gap-3">
              <StatBadge label="Itinerari" valore={String(totale)} />
              <StatBadge label="Regioni attive" valore={String(conItinerari)} />
              <StatBadge label="Regioni totali" valore="20" />
            </div>
          </Reveal>
        </div>
        <div className="strada-viva strada-viva-animata" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <Reveal>
          <div className="flex items-end justify-between gap-4 border-b border-asfalto/10 pb-4">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Scegli la regione
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-asfalto/40">
              Tocca per esplorare
            </span>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {regioni.map((r, i) => (
            <Reveal key={r.slug} delay={Math.min(i * 40, 320)}>
              <Link
                href={`/itinerari/regione/${r.slug}`}
                className={`card-regione group ${r.count === 0 ? 'card-regione-vuota' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-red-600">
                    {r.nome}
                  </h3>
                  {r.avvisi > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
                      Avvisi
                    </span>
                  )}
                </div>
                <p className="mt-2 font-mono text-xs uppercase tracking-wide text-asfalto/45">
                  {r.count === 0
                    ? 'In arrivo'
                    : `${r.count} ${r.count === 1 ? 'itinerario' : 'itinerari'}`}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-asfalto/35 transition-colors group-hover:text-red-600">
                  Esplora
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 rounded-app-lg border border-asfalto/10 bg-asfalto/[0.03] p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-asfalto/40">
              Conosci una strada?
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight">
              Proponi un nuovo giro
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-asfalto/60">
              Se hai un percorso che vale la pena condividere, scrivici a{' '}
              <a href="mailto:info@motogarage.it" className="text-brand hover:underline">info@motogarage.it</a>.
              Lo trasformiamo in itinerario con mappa, tappe e GPX.
            </p>
            <a
              href="mailto:info@motogarage.it?subject=Proposta%20itinerario%20MotoGarage"
              className="tap mt-5 inline-flex items-center rounded-app bg-asfalto px-5 py-3 font-mono text-xs font-bold uppercase tracking-wide text-cemento transition-colors hover:bg-red-600"
            >
              Proponi un giro
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function StatBadge({ label, valore }: { label: string; valore: string }) {
  return (
    <div className="rounded-app border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cemento/45">{label}</p>
      <p className="mt-0.5 font-display text-2xl font-black text-white">{valore}</p>
    </div>
  );
}
