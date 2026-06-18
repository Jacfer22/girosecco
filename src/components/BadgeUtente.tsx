'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAuth } from './AuthProvider';
import { badgeRaggiunto, prossimoBadge, avanzamento, BADGES } from '@/lib/badge';

export default function BadgeUtente() {
  const { user, nonConfigurato } = useAuth();
  const [km, setKm] = useState<number | null>(null);

  useEffect(() => {
    async function carica() {
      const supabase = getSupabaseBrowser();
      if (!supabase || !user) {
        setKm(0);
        return;
      }
      const { data } = await supabase.from('giri').select('km').eq('utente_id', user.id);
      const tot = (data ?? []).reduce((acc, r) => acc + (Number(r.km) || 0), 0);
      setKm(Math.round(tot));
    }
    carica();
  }, [user]);

  if (nonConfigurato) return null;
  if (km === null) {
    return <div className="skeleton h-28 rounded-app" />;
  }

  const attuale = badgeRaggiunto(km);
  const prossimo = prossimoBadge(km);
  const perc = avanzamento(km);
  const indiceAttuale = BADGES.findIndex((b) => b.id === attuale.id);

  return (
    <div className="rounded-app-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <span className="text-4xl" aria-hidden="true">{attuale.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wide text-guardrail">
            Il tuo livello
          </p>
          <p className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-cemento">
            {attuale.nome}
          </p>
          <p className="mt-0.5 font-mono text-xs text-guardrail">
            {km.toLocaleString('it-IT')} km registrati
          </p>
        </div>
        <span className="font-mono text-xs text-guardrail">
          {indiceAttuale + 1}/{BADGES.length}
        </span>
      </div>

      {prossimo ? (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-segnale transition-all duration-700"
              style={{ width: `${perc}%` }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-guardrail">
            {(prossimo.kmRichiesti - km).toLocaleString('it-IT')} km al badge
            «{prossimo.nome}» {prossimo.emoji}
          </p>
        </div>
      ) : (
        <p className="mt-4 font-mono text-xs uppercase tracking-wide text-segnale">
          Hai sbloccato tutti i badge. Leggenda. 👑
        </p>
      )}
    </div>
  );
}
