import { SupabaseClient } from '@supabase/supabase-js';
import { aggiornaProgressoGarage, pubblicaModelloGarage } from '@/lib/garage-model';
import { generaSplatDaImmagine } from '@/lib/triplane-hf';

interface MotoGenerazione {
  id: string;
  foto_sx_url: string | null;
}

export async function eseguiGenerazioneGemello(admin: SupabaseClient, moto: MotoGenerazione) {
  if (!moto.foto_sx_url) {
    throw new Error('Foto principale mancante.');
  }

  const progresso = async (progress: number, _messaggio: string) => {
    await aggiornaProgressoGarage(admin, moto.id, { progress, stato: 'elaborazione' });
  };

  await aggiornaProgressoGarage(admin, moto.id, {
    stato: 'elaborazione',
    progress: 5,
    errore: null,
    provider: 'huggingface-triposplat',
  });

  const { data: signed, error: signedError } = await admin.storage
    .from('foto-moto')
    .createSignedUrl(moto.foto_sx_url, 3600);
  if (signedError || !signed?.signedUrl) {
    throw new Error('Non riesco a leggere la foto della moto.');
  }

  await progresso(10, 'Lettura foto…');

  const foto = await fetch(signed.signedUrl);
  if (!foto.ok) throw new Error('Download foto fallito.');
  const bytes = new Uint8Array(await foto.arrayBuffer());
  const mime = foto.headers.get('content-type') ?? 'image/jpeg';

  const ply = await generaSplatDaImmagine(bytes, mime, progresso);

  await progresso(92, 'Pubblicazione nel garage…');
  await pubblicaModelloGarage(admin, moto.id, ply, 'ply', 'huggingface-triposplat');
}
