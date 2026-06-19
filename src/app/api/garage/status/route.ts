import { NextRequest, NextResponse } from 'next/server';
import { rispostaErroreApi, verificaUtente } from '@/lib/garage-server-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user, admin } = await verificaUtente(req);
    const motoId = req.nextUrl.searchParams.get('motoId')?.trim();
    if (!motoId) {
      return NextResponse.json({ errore: 'motoId richiesto.' }, { status: 400 });
    }

    const { data: moto, error } = await admin
      .from('moto')
      .select('id, utente_id, marca, modello, anno, stato, progress, errore, provider, model_url, model_format')
      .eq('id', motoId)
      .single();

    if (error || !moto) {
      return NextResponse.json({ errore: 'Moto non trovata.' }, { status: 404 });
    }
    if (moto.utente_id !== user.id) {
      return NextResponse.json({ errore: 'Non autorizzato.' }, { status: 403 });
    }

    return NextResponse.json({ moto });
  } catch (error) {
    const { messaggio, status } = rispostaErroreApi(error);
    return NextResponse.json({ errore: messaggio }, { status });
  }
}
