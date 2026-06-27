'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAuth } from '@/components/AuthProvider';
import { leggiGiroCelebrato } from '@/lib/giro-celebrazione';

interface Props {
  utenteId: string;
}

/** Banner hub: spinge a pubblicare se l'utente ha giri ma non ha ancora contribuito al feed. */
export default function CommunityInvitoHub({ utenteId }: Props) {
  const { user } = useAuth();
  const [mostra, setMostra] = useState(false);

  useEffect(() => {
    if (leggiGiroCelebrato()) return;

    async function verifica() {
      const supabase = getSupabaseBrowser();
      if (!supabase || !user) return;

      const [giriRes, pubRes, fotoRes] = await Promise.all([
        supabase.from('giri').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId),
        supabase.from('giri').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId).eq('pubblico', true),
        supabase.from('foto').select('id', { count: 'exact', head: true }).eq('autore_id', utenteId),
      ]);

      const haGiri = (giriRes.count ?? 0) > 0;
      const haContributo = (pubRes.count ?? 0) > 0 || (fotoRes.count ?? 0) > 0;
      setMostra(haGiri && !haContributo);
    }

    void verifica();
  }, [utenteId, user]);

  if (!mostra) return null;

  return (
    <section className="community-invito-hub animate-fade-in">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">Community</p>
      <p className="mt-1 font-display text-lg font-black uppercase leading-tight text-white">
        Fai vedere il tuo giro
      </p>
      <p className="mt-1.5 text-sm text-cemento/55">
        Hai km registrati ma il feed è ancora silenzioso. Pubblica un giro o una foto — gli altri rider
        partono da lì.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link href="/community" className="tap btn-primary text-center">
          Vai in community
        </Link>
        <Link href="/giri" className="tap editor-card-btn-secondary text-center">
          Pubblica un giro
        </Link>
      </div>
    </section>
  );
}
