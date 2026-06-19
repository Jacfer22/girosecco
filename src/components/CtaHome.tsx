'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function CtaHome() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex gap-3">
        <div className="skeleton h-12 w-44 rounded-app" />
        <div className="skeleton h-12 w-44 rounded-app" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/traccia"
          className="tap rounded-app bg-brand px-7 py-3.5 text-center font-mono text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-colors hover:bg-brand-chiaro"
        >
          Traccia un giro
        </Link>
        <Link
          href="/garage"
          className="tap rounded-app border border-white/20 px-7 py-3.5 text-center font-mono text-sm font-bold uppercase tracking-wide text-cemento/85 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          Il mio garage
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/itinerari"
        className="tap rounded-app bg-brand px-7 py-3.5 text-center font-mono text-sm font-bold uppercase tracking-wide text-white shadow-brand transition-colors hover:bg-brand-chiaro"
      >
        Esplora itinerari
      </Link>
      <Link
        href="/accedi"
        className="tap rounded-app border border-white/20 px-7 py-3.5 text-center font-mono text-sm font-bold uppercase tracking-wide text-cemento/85 transition-colors hover:border-white/40 hover:bg-white/5"
      >
        Accedi / Registrati
      </Link>
    </div>
  );
}
