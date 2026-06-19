import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { eseguiGenerazioneGemello } from '@/lib/garage-generate';
import { aggiornaProgressoGarage } from '@/lib/garage-model';
import { PROVIDER_APPROVAZIONE, PROVIDER_HF, puoGenerareAutomaticamente } from '@/lib/garage-limite';
import { rispostaErroreApi, verificaUtente } from '@/lib/garage-server-auth';

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user, admin } = await verificaUtente(req);
    const body = await req.json() as { motoId?: string };
    const motoId = String(body.motoId ?? '').trim();
    if (!motoId) {
      return NextResponse.json({ errore: 'motoId richiesto.' }, { status: 400 });
    }

    const { data: moto, error } = await admin
      .from('moto')
      .select('id, utente_id, stato, foto_sx_url')
      .eq('id', motoId)
      .single();

    if (error || !moto) {
      return NextResponse.json({ errore: 'Moto non trovata.' }, { status: 404 });
    }
    if (moto.utente_id !== user.id) {
      return NextResponse.json({ errore: 'Non autorizzato.' }, { status: 403 });
    }
    if (!['in_attesa', 'errore'].includes(moto.stato)) {
      return NextResponse.json({ errore: 'Questa moto non è in coda di generazione.' }, { status: 409 });
    }

    const auto = await puoGenerareAutomaticamente(admin, user.id, motoId);
    if (!auto) {
      await aggiornaProgressoGarage(admin, motoId, {
        stato: 'in_attesa',
        progress: 0,
        errore: null,
        provider: PROVIDER_APPROVAZIONE,
      });
      return NextResponse.json({
        ok: true,
        stato: 'in_attesa',
        richiedeApprovazione: true,
      });
    }

    await aggiornaProgressoGarage(admin, motoId, {
      stato: 'elaborazione',
      progress: 2,
      errore: null,
      provider: PROVIDER_HF,
    });

    after(async () => {
      try {
        await eseguiGenerazioneGemello(admin, moto);
      } catch (errore) {
        const messaggio = errore instanceof Error ? errore.message : 'Generazione fallita.';
        await aggiornaProgressoGarage(admin, motoId, {
          stato: 'errore',
          progress: 0,
          errore: messaggio,
        }).catch(() => {});
      }
    });

    return NextResponse.json({ ok: true, stato: 'elaborazione' });
  } catch (error) {
    const { messaggio, status } = rispostaErroreApi(error);
    return NextResponse.json({ errore: messaggio }, { status });
  }
}
