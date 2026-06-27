'use client';

import Link from 'next/link';
import { usePrimiPassi } from '@/hooks/use-primi-passi';

interface Props {
  utenteId: string;
  profiloOk: boolean;
}

export default function ChecklistHub({ utenteId, profiloOk }: Props) {
  const progresso = usePrimiPassi(utenteId, profiloOk);

  if (!progresso || !progresso.incompleto) return null;

  const passi = [
    { ok: progresso.profilo, titolo: 'Scegli il tuo username', href: '/account' },
    { ok: progresso.giro, titolo: 'Traccia il primo giro', href: '/traccia' },
    { ok: progresso.moto, titolo: 'Crea l\'avatar 3D moto', href: '/garage' },
    { ok: progresso.community, titolo: 'Pubblica in community', href: '/community' },
  ];
  const completati = passi.filter((p) => p.ok).length;

  return (
    <section className="pb-2">
      <div className="rounded-app-lg border border-brand/25 bg-brand/[0.06] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">Primi passi</p>
            <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-white">
              {completati}/4 completati
            </p>
          </div>
          <div className="hub-progress-track" aria-hidden="true">
            {passi.map((passo, i) => (
              <span
                key={passo.titolo}
                className={`hub-progress-segment ${passo.ok ? 'is-done' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {passi.filter((p) => !p.ok).map((passo) => (
            <li key={passo.titolo}>
              <Link
                href={passo.href}
                className="tap flex items-center justify-between rounded-app border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-cemento transition-colors hover:border-brand/30"
              >
                <span>{passo.titolo}</span>
                <span className="font-mono text-[10px] uppercase text-brand">Vai →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Esportato per TutorialPrimoAccesso: salta il tutorial se la checklist è visibile */
export function useChecklistVisibile(utenteId: string | undefined, profiloOk: boolean) {
  const progresso = usePrimiPassi(utenteId, profiloOk);
  return progresso?.incompleto ?? false;
}
