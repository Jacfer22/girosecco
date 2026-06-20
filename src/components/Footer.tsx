'use client';

import { usePathname } from 'next/navigation';
import Logo from './Logo';

const PAGINE_IMMERSIVE = ['/naviga', '/traccia'];

export default function Footer() {
  const pathname = usePathname();
  const immersivo = PAGINE_IMMERSIVE.some((p) => pathname.startsWith(p));

  if (immersivo) {
    return null;
  }

  return (
    <footer className="mt-16 bg-asfalto text-cemento">
      <div className="strada-viva" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Logo variante="footer" />
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-guardrail/90">
          Crea l&apos;avatar 3D della tua moto, personalizza il tuo garage virtuale
          e connettiti con la community di motociclisti italiani.
        </p>
        <p className="mt-6 text-xs text-guardrail/70">MotoGarage · Italia</p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-wide text-guardrail/70">
          <a href="/privacy" className="hover:text-brand">Privacy</a>
          <a href="/termini" className="hover:text-brand">Termini</a>
          <a href="mailto:info@motogarage.it" className="hover:text-brand">Contatti</a>
        </div>
      </div>
    </footer>
  );
}
