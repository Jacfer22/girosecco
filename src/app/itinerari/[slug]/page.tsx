import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getItinerario } from '@/lib/supabase';
import MappaItinerario from '@/components/MappaItinerario';
import AvvisoBanner from '@/components/AvvisoBanner';
import { ChipDato, ChipDifficolta } from '@/components/Chips';

export const revalidate = 3600;

const TIPO_LABEL: Record<string, string> = {
  partenza: 'Partenza',
  panorama: 'Panorama',
  cibo: 'Dove si mangia',
  benzina: 'Benzina',
  sosta: 'Sosta',
  arrivo: 'Arrivo',
};

export default async function PaginaItinerario({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const itinerario = await getItinerario(slug);
  if (!itinerario) notFound();

  const tappe = itinerario.tappe ?? [];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/#itinerari"
        className="font-mono text-sm uppercase text-asfalto/60 hover:text-asfalto"
      >
        ← Tutti gli itinerari
      </Link>

      <header className="mt-4">
        <p className="font-mono text-sm uppercase tracking-widest text-cartello">
          {itinerario.zona}
        </p>
        <h1 className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-7xl">
          {itinerario.titolo}
        </h1>
        <p className="mt-3 text-lg text-asfalto/70">{itinerario.sottotitolo}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ChipDato label="km" value={String(itinerario.km)} />
          <ChipDato label="ore" value={`~${itinerario.durata_ore}`} />
          <ChipDifficolta value={itinerario.difficolta} />
          <ChipDato label="quando" value={itinerario.periodo_ideale} />
        </div>
      </header>

      <AvvisoBanner avvisi={itinerario.avvisi ?? []} />

      <div className="mt-8">
        {tappe.length > 0 ? (
          <MappaItinerario tappe={tappe} tracciato={itinerario.tracciato ?? []} />
        ) : (
          <div className="flex h-72 items-center justify-center border-2 border-dashed border-asfalto/30 font-mono text-sm text-asfalto/50">
            Mappa in arrivo
          </div>
        )}
        {itinerario.strada && (
          <p className="mt-2 font-mono text-xs uppercase tracking-wide text-asfalto/50">
            Percorso: {itinerario.strada}
            {itinerario.strada_fonte && <> · fonte: {itinerario.strada_fonte}</>}
          </p>
        )}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
          Il giro
        </h2>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-asfalto/85">
          {itinerario.descrizione}
        </p>
      </section>

      {tappe.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
            Roadbook
          </h2>
          <ol className="mt-4 divide-y-2 divide-asfalto/10 border-2 border-asfalto bg-white">
            {tappe.map((t) => (
              <li key={t.id} className="flex gap-4 px-4 py-3">
                <span className="font-mono text-lg font-medium text-cartello">
                  {String(t.ordine).padStart(2, '0')}
                </span>
                <div>
                  <p className="font-medium">
                    {t.nome}
                    <span className="ml-2 font-mono text-xs uppercase text-asfalto/50">
                      {TIPO_LABEL[t.tipo] ?? t.tipo}
                    </span>
                  </p>
                  {t.note && <p className="text-sm text-asfalto/70">{t.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Contenuti Pro: variante percorso + pacchetto weekend */}
      {itinerario.is_premium && itinerario.pro_extra && (
        <section className="mt-10 border-2 border-segnale bg-white">
          <div className="flex items-center gap-2 border-b-2 border-segnale bg-asfalto px-4 py-2">
            <span className="bg-segnale px-2 py-0.5 font-mono text-xs font-medium uppercase text-asfalto">
              Pro
            </span>
            <span className="font-mono text-xs uppercase tracking-wide text-guardrail">
              Contenuti riservati
            </span>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                Variante del percorso
              </h3>
              <p className="mt-1 text-asfalto/85">{itinerario.pro_extra.variante}</p>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight">
                Pacchetto weekend
              </h3>
              <p className="mt-1 text-asfalto/85">{itinerario.pro_extra.weekend}</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-10 border-2 border-asfalto bg-asfalto p-6 text-cemento">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
          Traccia GPX
        </h2>
        {itinerario.gpx_url && !itinerario.is_premium ? (
          <>
            <p className="mt-2 text-guardrail">
              Scarica la traccia e caricala sul navigatore o sull’app che usi.
            </p>
            <a
              href={itinerario.gpx_url}
              download
              className="mt-4 inline-block bg-segnale px-5 py-2.5 font-mono font-medium uppercase text-asfalto hover:bg-white"
            >
              Scarica GPX
            </a>
          </>
        ) : itinerario.is_premium ? (
          <>
            <p className="mt-2 text-guardrail">
              Questo è un itinerario Pro: GPX, varianti del percorso e pacchetto
              weekend completo sono riservati agli iscritti.
            </p>
            <Link
              href="/pro"
              className="mt-4 inline-block bg-segnale px-5 py-2.5 font-mono font-medium uppercase text-asfalto hover:bg-white"
            >
              Sblocca con Pro
            </Link>
          </>
        ) : (
          <p className="mt-2 font-mono text-sm text-guardrail">
            GPX in arrivo per questo itinerario.
          </p>
        )}
      </section>
    </article>
  );
}
