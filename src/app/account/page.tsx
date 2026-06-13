'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useAuth } from '@/components/AuthProvider';

export default function PaginaAccount() {
  const router = useRouter();
  const { user, profilo, loading, nonConfigurato } = useAuth();
  const supabase = getSupabaseBrowser();

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (nonConfigurato) {
    return (
      <section className="mx-auto max-w-md px-4 py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">
          Account non disponibile
        </h1>
        <p className="mt-3 text-asfalto/70">
          Il sito non è ancora collegato a Supabase in questo ambiente.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-md px-4 py-14">
        <p className="font-mono text-sm uppercase text-asfalto/50">Caricamento…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">
          Non hai effettuato l’accesso
        </h1>
        <Link
          href="/accedi"
          className="mt-4 inline-block bg-segnale px-5 py-2.5 font-mono font-medium uppercase text-asfalto hover:bg-white"
        >
          Vai al login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <p className="font-mono text-sm uppercase tracking-widest text-cartello">
        Account
      </p>
      <h1 className="mt-1 font-display text-5xl font-bold uppercase leading-none tracking-tight">
        Ciao
      </h1>

      <div className="mt-6 border-2 border-asfalto bg-white p-5">
        <p className="font-mono text-xs uppercase text-asfalto/50">Email</p>
        <p className="mt-1">{user.email}</p>

        <p className="mt-4 font-mono text-xs uppercase text-asfalto/50">Stato</p>
        <p className="mt-1">
          {profilo?.is_pro ? (
            <span className="bg-segnale px-2 py-0.5 font-mono text-xs font-medium uppercase text-asfalto">
              Pro attivo
            </span>
          ) : (
            <>
              Account free —{' '}
              <Link href="/pro" className="underline">
                passa a Pro
              </Link>
            </>
          )}
        </p>

        {profilo?.moto && (
          <>
            <p className="mt-4 font-mono text-xs uppercase text-asfalto/50">Moto</p>
            <p className="mt-1">{profilo.moto}</p>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 border-2 border-asfalto px-5 py-2.5 font-mono font-medium uppercase hover:bg-asfalto hover:text-cemento"
      >
        Esci
      </button>
    </section>
  );
}
