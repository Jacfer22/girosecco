'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const CHIAVE = 'motogarage-pwa-dismiss';

export default function InstallaPwa() {
  const [evento, setEvento] = useState<BeforeInstallPromptEvent | null>(null);
  const [nascosto, setNascosto] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(CHIAVE)) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    function onPrompt(e: Event) {
      e.preventDefault();
      setEvento(e as BeforeInstallPromptEvent);
      setNascosto(false);
    }

    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  async function installa() {
    if (!evento) return;
    await evento.prompt();
    const scelta = await evento.userChoice;
    if (scelta.outcome === 'accepted') {
      setNascosto(true);
      setEvento(null);
    }
  }

  function chiudi() {
    localStorage.setItem(CHIAVE, '1');
    setNascosto(true);
  }

  if (nascosto || !evento) return null;

  return (
    <div
      className="fixed inset-x-0 z-50 mx-auto max-w-md px-3 md:hidden"
      style={{ bottom: 'calc(76px + env(safe-area-inset-bottom) + 8px)' }}
    >
      <div className="flex items-center gap-3 rounded-app-lg border border-white/10 bg-asfalto p-3 shadow-app-lg">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wide text-brand">App sul telefono</p>
          <p className="mt-0.5 text-xs leading-snug text-cemento/80">
            Aggiungi Moto Garage alla Home per GPS e navigatore come un&apos;app.
          </p>
        </div>
        <button
          type="button"
          onClick={installa}
          className="tap shrink-0 rounded-app bg-brand px-3 py-2.5 font-mono text-[10px] font-bold uppercase text-white"
        >
          Installa
        </button>
        <button
          type="button"
          onClick={chiudi}
          className="tap shrink-0 px-1 font-mono text-lg text-cemento/50"
          aria-label="Chiudi"
        >
          ×
        </button>
      </div>
    </div>
  );
}
