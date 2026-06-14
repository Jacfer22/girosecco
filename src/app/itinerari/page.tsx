import Link from 'next/link';
import { getItinerari } from '@/lib/supabase';
import { REGIONI } from '@/lib/regioni';

export const revalidate = 3600;

export const metadata = {
  title: 'Itinerari moto in Italia — GiroSecco',
  description:
    'Itinerari in moto regione per regione, con mappa, roadbook e traccia GPX. Percorsi condivisi e aggiornati dalla community.',
};

export default async function PaginaItinerari() {
  const itinerari = await getItinerari();

  // Conteggio itinerari per regione (un giro può contare in più regioni)
  const conteggio = new Map<string, number>();
  for (const it of itinerari) {
    for (const r of it.regioni ?? []) {
      conteggio.set(r, (conteggio.get(r) ?? 0) + 1);
    }
  }

  const conGiri = REGIONI.filter((r) => (conteggio.get(r.slug) ?? 0) > 0);
  const senzaGiri = REGIONI.filter((r) => (conteggio.get(r.slug) ?? 0) === 0);
  const totale = itinerari.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="font-mono text-sm uppercase tracking-widest text-cartello">Italia</p>
      <h1 className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-7xl">
        Scegli la regione
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-asfalto/75">
        Gli itinerari sono divisi per regione. Ogni giro ha mappa, roadbook e
        traccia GPX. I percorsi li propone e aggiorna la community: se conosci
        una strada che vale, puoi aggiungerla.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
        <span className="border-2 border-asfalto px-3 py-1.5">
          {totale} {totale === 1 ? 'itinerario' : 'itinerari'}
        </span>
        <span className="border-2 border-asfalto px-3 py-1.5">
          {conGiri.length} {conGiri.length === 1 ? 'regione attiva' : 'regioni attive'}
        </span>
      </div>

      {conGiri.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl font-bold uppercase tracking-tight">
            Con itinerari
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {conGiri.map((r) => (
              <Link
                key={r.slug}
                href={`/itinerari/regione/${r.slug}`}
                className="group flex items-center justify-between border-2 border-asfalto bg-white p-4 transition-colors hover:bg-asfalto hover:text-cemento"
              >
                <span className="font-display text-xl font-bold uppercase leading-tight tracking-tight">
                  {r.nome}
                </span>
                <span className="ml-2 shrink-0 bg-segnale px-2 py-0.5 font-mono text-xs font-medium text-asfalto">
                  {conteggio.get(r.slug)}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-12 font-display text-2xl font-bold uppercase tracking-tight">
        Altre regioni
      </h2>
      <p className="mt-1 text-sm text-asfalto/60">
        Ancora senza itinerari. Le prime strade le aggiunge chi le conosce.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {senzaGiri.map((r) => (
          <Link
            key={r.slug}
            href={`/itinerari/regione/${r.slug}`}
            className="flex items-center justify-between border-2 border-asfalto/20 p-4 text-asfalto/40 transition-colors hover:border-asfalto/40"
          >
            <span className="font-display text-xl font-bold uppercase leading-tight tracking-tight">
              {r.nome}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
