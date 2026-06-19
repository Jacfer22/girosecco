import { NextRequest, NextResponse } from 'next/server';
import { eliminaMotoGarage } from '@/lib/garage-elimina';
import { rispostaErroreApi, verificaUtente } from '@/lib/garage-server-auth';

export const runtime = 'nodejs';
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
      .select('id, utente_id, foto_sx_url, foto_dx_url, model_format')
      .eq('id', motoId)
      .single();

    if (error || !moto) {
      return NextResponse.json({ errore: 'Moto non trovata.' }, { status: 404 });
    }

    await eliminaMotoGarage(admin, moto, user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const { messaggio, status } = rispostaErroreApi(error);
    return NextResponse.json({ errore: messaggio }, { status });
  }
}
