'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface Props {
  utenteId: string;
  profiloOk: boolean;
}

interface Progresso {
  profilo: boolean;
  giro: boolean;
  moto: boolean;
}

export default function ChecklistHub({ utenteId, profiloOk }: Props) {
  const [progresso, setProgresso] = useState<Progresso | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    async function carica() {
      if (!supabase) return;
      const [giriRes, motoRes] = await Promise.all([
        supabase.from('giri').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId),
        supabase.from('moto').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId),
      ]);

      setProgresso({
        profilo: profiloOk,
        giro: (giriRes.count ?? 0) > 0,
        moto: (motoRes.count ?? 0) > 0,
      });
    }

    void carica();
  }, [utenteId, profiloOk]);

  if (!progresso) return null;

  const completati = [progresso.profilo, progresso.giro, progresso.moto].filter(Boolean).length;
  if (completati === 3) return null;

  const passi = [
    { ok: progresso.profilo, titolo: 'Completa il profilo', href: '/account' },
    { ok: progresso.giro, titolo: 'Traccia il primo giro', href: '/traccia' },
    { ok: progresso.moto, titolo: 'Crea l\'avatar 3D moto', href: '/garage' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-2">
      <div className="rounded-app-lg border border-brand/25 bg-brand/[0.06] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">Primi passi</p>
            <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight">
              {completati}/3 completati
            </p>
          </div>
          <div className="flex gap-1">
            {passi.map((passo) => (
              <span
                key={passo.titolo}
                className={`h-2 w-10 rounded-full ${passo.ok ? 'bg-brand' : 'bg-asfalto/15 dark:bg-white/15'}`}
              />
            ))}
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {passi.filter((p) => !p.ok).map((passo) => (
            <li key={passo.titolo}>
              <Link
                href={passo.href}
                className="tap flex items-center justify-between rounded-app border border-asfalto/10 bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-brand/30 dark:bg-carbone dark:border-white/10"
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
