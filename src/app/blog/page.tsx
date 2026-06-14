import Link from 'next/link';
import { getArticoliPubblicati } from '@/lib/supabase';

// Esempi mostrati finché non ci sono articoli pubblicati dalla community.
const ESEMPI = [
  {
    id: 'esempio-braccianese',
    titolo: 'La Braccianese Claudia: perché è la strada di casa dei romani',
    data: '10 giugno 2026',
    autore: 'GiroSecco',
    anteprima:
      'Chilometri di asfalto curato, curve in appoggio sul mare, butteri a cavallo se sei fortunato. La SP3A Braccianese Claudia non fa notizia ma è il posto dove si torna ogni domenica. Ecco perché.',
  },
  {
    id: 'esempio-adventure',
    titolo: 'Adventure nel Lazio: dove finisce la strada asfaltata',
    data: '2 giugno 2026',
    autore: 'GiroSecco',
    anteprima:
      "Non serve l'Himalaya. A un'ora da Roma ci sono sentieri e strade bianche che mettono alla prova qualsiasi adventure. Una guida ai percorsi misti del Lazio, con consigli su quando andare e cosa portare.",
  },
];

function formattaData(iso: string): string {
  return new Date(iso).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PaginaBlog() {
  const articoli = await getArticoliPubblicati();

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <p className="font-mono text-sm uppercase tracking-widest text-cartello">
        GiroSecco
      </p>
      <h1 className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-tight">
        Blog
      </h1>
      <p className="mt-3 max-w-xl text-asfalto/70">
        Strade, moto e storie da chi guida davvero. Scritto dalla community,
        revisionato da noi prima della pubblicazione.
      </p>

      <div className="mt-6 border-2 border-asfalto bg-asfalto p-5 text-cemento">
        <p className="font-display text-xl font-bold uppercase tracking-tight">
          Hai un giro da raccontare?
        </p>
        <p className="mt-1 text-sm text-guardrail">
          Gli utenti registrati possono scrivere un articolo. Lo revisioniamo
          e, se va bene, lo pubblichiamo qui.
        </p>
        <Link
          href="/blog/nuovo"
          className="mt-3 inline-block bg-segnale px-4 py-2 font-mono text-sm font-medium uppercase text-asfalto hover:bg-white"
        >
          Scrivi un articolo
        </Link>
      </div>

      <div className="mt-10 space-y-6">
        {articoli.length === 0
          ? ESEMPI.map((a) => (
              <article key={a.id} className="border-2 border-asfalto bg-white p-6">
                <p className="font-mono text-xs uppercase tracking-wide text-asfalto/50">
                  {a.autore} · {a.data}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight">
                  {a.titolo}
                </h2>
                <p className="mt-3 leading-relaxed text-asfalto/80">{a.anteprima}</p>
              </article>
            ))
          : articoli.map((a) => (
              <article key={a.id} className="border-2 border-asfalto bg-white p-6 hover:bg-cemento">
                <p className="font-mono text-xs uppercase tracking-wide text-asfalto/50">
                  {a.autore?.username ?? 'GiroSecco'}
                  {a.pubblicato_at && <> · {formattaData(a.pubblicato_at)}</>}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight">
                  <Link href={`/blog/${a.id}`} className="hover:underline">
                    {a.titolo}
                  </Link>
                </h2>
                <p className="mt-3 line-clamp-3 leading-relaxed text-asfalto/80">{a.contenuto}</p>
                <Link
                  href={`/blog/${a.id}`}
                  className="mt-3 inline-block font-mono text-xs uppercase tracking-wide text-asfalto/50 underline hover:text-asfalto"
                >
                  Leggi tutto →
                </Link>
              </article>
            ))}
      </div>

      <p className="mt-12">
        <Link href="/hub" className="font-mono text-sm uppercase text-asfalto/60 underline hover:text-asfalto">
          ← Torna all&apos;hub
        </Link>
      </p>
    </section>
  );
}
