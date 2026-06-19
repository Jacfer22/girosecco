import Link from 'next/link';
import { Accesso, Itinerario } from '@/lib/types';
import { ChipDato, ChipDifficolta } from './Chips';

function BadgeAccesso({ accesso }: { accesso: Accesso }) {
  const stili: Record<Accesso, { bg: string; testo: string; label: string }> = {
    aperto: { bg: 'bg-emerald-700/90', testo: 'text-white', label: 'Libero' },
    registrati: { bg: 'bg-asfalto/90', testo: 'text-cemento', label: 'Gratis' },
    pro: { bg: 'bg-red-600', testo: 'text-white', label: 'Pro' },
  };
  const s = stili[accesso];
  return (
    <span className={`${s.bg} ${s.testo} rounded-full px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.14em]`}>
      {s.label}
    </span>
  );
}

export default function ItinerarioCard({
  itinerario,
  haAvviso = false,
  accesso,
}: {
  itinerario: Itinerario;
  haAvviso?: boolean;
  accesso?: Accesso;
}) {
  const bloccato = accesso === 'pro';

  return (
    <Link
      href={`/itinerari/${itinerario.slug}`}
      className="card-app group flex flex-col overflow-hidden"
    >
      <div className="relative flex items-center justify-between gap-2 bg-asfalto px-4 py-3">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-cemento/55">
          {itinerario.zona}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {haAvviso && (
            <span className="rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[9px] font-medium uppercase text-asfalto">
              Avviso
            </span>
          )}
          {accesso && <BadgeAccesso accesso={accesso} />}
        </div>
        {/* accento curva strada */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl font-bold uppercase leading-none tracking-tight transition-colors group-hover:text-red-600 sm:text-3xl">
          {itinerario.titolo}
        </h3>
        <p className="text-sm leading-relaxed text-asfalto/60">{itinerario.sottotitolo}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <ChipDato label="km" value={String(itinerario.km)} />
          <ChipDato label="ore" value={`~${itinerario.durata_ore}`} />
          <ChipDifficolta value={itinerario.difficolta} />
          {bloccato && (
            <span className="ml-auto font-mono text-[10px] uppercase tracking-wide text-asfalto/35">
              Con Pro
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
