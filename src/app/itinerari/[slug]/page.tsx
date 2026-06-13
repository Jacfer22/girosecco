import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getItinerario } from '@/lib/supabase';
import MappaItinerario from '@/components/MappaItinerario';
import AvvisoBanner from '@/components/AvvisoBanner';
import ContenutoPro from '@/components/ContenutoPro';
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

      <ContenutoPro
        isPremium={itinerario.is_premium}
        proExtra={itinerario.pro_extra}
        gpxUrl={itinerario.gpx_url}
      />
    </article>
  );
}
