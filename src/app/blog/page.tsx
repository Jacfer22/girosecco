import Link from 'next/link';
import { getArticoliPubblicati } from '@/lib/supabase';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Blog — MotoGarage',
  description: 'Storie, strade e racconti dalla community di motociclisti italiani.',
};

function formattaData(iso: string): string {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function PaginaBlog() {
  const articoli = await getArticoliPubblicati();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-14">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-asfalto/40">
          Community · racconti
        </p>
        <h1 className="mt-2 font-display text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl">
          Blog
        </h1>
        <p className="mt-4 text-base leading-relaxed text-asfalto/65 sm:text-lg">
          Strade, viaggi e opinioni da chi guida. Un posto per parlare di moto, non solo di numeri.
        </p>
      </Reveal>

      <Reveal delay={60}>
        <div className="mt-8">
          <Link
            href="/blog/nuovo"
            className="tap inline-flex items-center rounded-app border border-asfalto/15 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wide transition-colors hover:border-red-600 hover:text-red-600"
          >
            Scrivi un articolo
          </Link>
        </div>
      </Reveal>

      {articoli.length === 0 ? (
        <Reveal delay={100}>
          <div className="mt-12 rounded-app-lg border border-dashed border-asfalto/20 p-8 text-center">
            <p className="font-display text-2xl font-bold uppercase tracking-tight text-asfalto/35">
              Ancora nessun articolo
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-asfalto/55">
              Il blog è appena partito. Sii tra i primi a raccontare un giro, una strada o un consiglio.
            </p>
          </div>
        </Reveal>
      ) : (
        <ul className="mt-10 space-y-4">
          {articoli.map((a, i) => (
            <Reveal key={a.id} delay={Math.min(i * 50, 300)}>
              <li>
                <Link href={`/blog/${a.id}`} className="card-app group block p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-asfalto/40">
                    {a.autore?.username ?? 'MotoGarage'}
                    {a.pubblicato_at && <> · {formattaData(a.pubblicato_at)}</>}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-red-600 sm:text-3xl">
                    {a.titolo}
                  </h2>
                  {a.contenuto && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-asfalto/60">
                      {a.contenuto}
                    </p>
                  )}
                  <span className="mt-4 inline-block font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-asfalto/35 transition-colors group-hover:text-red-600">
                    Leggi →
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  );
}
