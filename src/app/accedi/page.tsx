'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { SITE_URL } from '@/lib/home-href';
import CardDemoAnteprima from '@/components/CardDemoAnteprima';
import Logo from '@/components/Logo';

type Modalita = 'accedi' | 'registrati';

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

const PERCHE = [
  'Giri GPS salvati nel cloud',
  'Card social pronta da condividere',
  'Garage con avatar 3D della moto',
  'Itinerari e community di biker',
];

export default function PaginaAccedi() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  const [modalita, setModalita] = useState<Modalita>('accedi');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState<string | null>(null);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [caricamento, setCaricamento] = useState(false);
  const [giaLoggato, setGiaLoggato] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#registrati') {
      setModalita('registrati');
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setGiaLoggato(true);
        setTimeout(() => { window.location.href = '/hub'; }, 800);
      }
    });
  }, [supabase]);

  if (!supabase) {
    return (
      <section className="mx-auto max-w-md px-4 py-14">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">
          Accesso non disponibile
        </h1>
        <p className="mt-3 text-asfalto/70">
          Configura le variabili Supabase per attivare login e registrazione.
        </p>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrore(null);
    setMessaggio(null);

    if (modalita === 'registrati' && !USERNAME_REGEX.test(username)) {
      setErrore('Username: 3-20 caratteri, solo lettere minuscole, numeri e underscore.');
      return;
    }

    setCaricamento(true);

    if (modalita === 'accedi') {
      const { error } = await supabase!.auth.signInWithPassword({ email, password });
      setCaricamento(false);
      if (error) {
        setErrore(
          error.message.includes('Invalid login')
            ? 'Email o password non corretti.'
            : error.message.includes('not confirmed')
              ? 'Conferma l\'email: controlla la posta e clicca sul link.'
              : error.message
        );
        return;
      }
      router.refresh();
      window.location.href = '/hub';
    } else {
      const { error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${SITE_URL}/accedi`,
        },
      });
      setCaricamento(false);
      if (error) {
        setErrore(
          error.message.includes('already registered')
            ? 'Email già registrata. Prova ad accedere.'
            : error.message
        );
        return;
      }
      setMessaggio(
        `Email inviata a ${email}. Conferma il link, poi accedi.`
      );
      setModalita('accedi');
      setPassword('');
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-hero">
        <Logo variante="footer" />
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.28em] text-brand">MotoGarage</p>
        <h1 className="mt-3 max-w-md font-display text-5xl font-black uppercase leading-none tracking-tight">
          Il tuo garage digitale in tasca
        </h1>
        <ul className="mt-8 space-y-3">
          {PERCHE.map((voce) => (
            <li key={voce} className="flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-cemento/75">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">✓</span>
              {voce}
            </li>
          ))}
        </ul>
        <div className="mt-10 hidden lg:block">
          <CardDemoAnteprima />
        </div>
      </aside>

      <section className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-10 sm:py-14">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-asfalto/40 lg:hidden">MotoGarage</p>

        <div className="mt-2 flex rounded-app border border-asfalto/10 p-1 dark:border-white/10">
          {(['accedi', 'registrati'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setModalita(m);
                setErrore(null);
                setMessaggio(null);
              }}
              className={`tap flex-1 rounded-app py-2.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors ${
                modalita === m ? 'bg-brand text-white' : 'text-asfalto/55 dark:text-cemento/55'
              }`}
            >
              {m === 'accedi' ? 'Accedi' : 'Registrati'}
            </button>
          ))}
        </div>

        <h2 className="mt-6 font-display text-4xl font-black uppercase leading-none tracking-tight">
          {modalita === 'accedi' ? 'Bentornato' : 'Crea account'}
        </h2>
        <p className="mt-2 text-sm text-asfalto/65 dark:text-cemento/65">
          {modalita === 'accedi'
            ? 'Accedi per giri, garage e community.'
            : 'Gratis — nessuna carta richiesta.'}
        </p>

        {giaLoggato && (
          <p className="auth-successo mt-4">
            Sei già loggato — <Link href="/hub" className="underline">vai all&apos;hub</Link>
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {modalita === 'registrati' && (
            <label className="block">
              <span className="label-app">Username</span>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="input-app lowercase"
                placeholder="es. moto_roma"
                pattern="[a-z0-9_]{3,20}"
                autoCapitalize="none"
              />
            </label>
          )}

          <label className="block">
            <span className="label-app">Email</span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-app"
              placeholder="nome@esempio.it"
            />
          </label>

          <label className="block">
            <span className="label-app">Password</span>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-app"
              placeholder="Almeno 6 caratteri"
            />
          </label>

          {errore && <p className="auth-errore">{errore}</p>}
          {messaggio && <p className="auth-successo">{messaggio}</p>}

          <button type="submit" disabled={caricamento} className="btn-primary w-full">
            {caricamento ? 'Un momento…' : modalita === 'accedi' ? 'Accedi' : 'Crea account'}
          </button>

          {modalita === 'registrati' && (
            <p className="text-center font-mono text-[10px] leading-relaxed text-asfalto/45">
              Accetti <Link href="/termini" className="underline">Termini</Link> e{' '}
              <Link href="/privacy" className="underline">Privacy</Link>.
            </p>
          )}
        </form>

        <div className="mt-8 scale-[0.92] lg:hidden">
          <CardDemoAnteprima />
        </div>

        <p className="mt-6 font-mono text-xs text-asfalto/40">
          <Link href="/" className="underline hover:text-brand">← Torna alla home</Link>
        </p>
      </section>
    </div>
  );
}
