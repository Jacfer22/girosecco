const MESSAGGIO_MANCANTE = 'Configurazione server incompleta. Aggiungi su Vercel (Settings → Environment Variables) e in .env.local:';

export function supabaseUrlServer(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
}

export function supabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
}

export function supabaseServiceRoleKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    ?? process.env.SUPABASE_SERVICE_KEY?.trim()
    ?? ''
  );
}

export function huggingFaceToken(): string {
  return process.env.HUGGINGFACE_TOKEN?.trim() ?? '';
}

export function verificaConfigServer(): void {
  const mancanti: string[] = [];
  if (!supabaseUrlServer()) mancanti.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey()) mancanti.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!supabaseServiceRoleKey()) mancanti.push('SUPABASE_SERVICE_ROLE_KEY');
  if (mancanti.length > 0) {
    throw new Error(`${MESSAGGIO_MANCANTE} ${mancanti.join(', ')}`);
  }
}

export function verificaConfigGenerazione(): void {
  verificaConfigServer();
  if (!huggingFaceToken()) {
    throw new Error(`${MESSAGGIO_MANCANTE} HUGGINGFACE_TOKEN`);
  }
}

export function statoConfigServer() {
  return {
    supabaseUrl: !!supabaseUrlServer(),
    anonKey: !!supabaseAnonKey(),
    serviceRole: !!supabaseServiceRoleKey(),
    huggingFace: !!huggingFaceToken(),
  };
}
