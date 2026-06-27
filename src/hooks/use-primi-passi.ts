'use client';

import { useEffect, useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export interface ProgressoPrimiPassi {
  profilo: boolean;
  giro: boolean;
  moto: boolean;
  community: boolean;
  incompleto: boolean;
}

export function usePrimiPassi(utenteId: string | undefined, profiloOk: boolean) {
  const [progresso, setProgresso] = useState<ProgressoPrimiPassi | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase || !utenteId) {
      setProgresso(null);
      return;
    }

    async function carica() {
      const [giriRes, motoRes, giriPubRes, fotoRes] = await Promise.all([
        supabase!.from('giri').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId!),
        supabase!.from('moto').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId!),
        supabase!.from('giri').select('id', { count: 'exact', head: true }).eq('utente_id', utenteId!).eq('pubblico', true),
        supabase!.from('foto').select('id', { count: 'exact', head: true }).eq('autore_id', utenteId!),
      ]);

      const profilo = profiloOk;
      const giro = (giriRes.count ?? 0) > 0;
      const moto = (motoRes.count ?? 0) > 0;
      const community = (giriPubRes.count ?? 0) > 0 || (fotoRes.count ?? 0) > 0;
      const incompleto = !profilo || !giro || !moto || !community;

      setProgresso({ profilo, giro, moto, community, incompleto });
    }

    void carica();
  }, [utenteId, profiloOk]);

  return progresso;
}
