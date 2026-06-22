'use client';

import Link from 'next/link';
import { homeHref } from '@/lib/home-href';
import Logo from '@/components/Logo';

interface Props {
  onClick?: () => void;
  className?: string;
}

/** Logo + nome in alto a sinistra — link pulito, scorre con la pagina. */
export default function LogoHomeLink({ onClick, className = '' }: Props) {
  const href = homeHref();

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Torna alla home MotoGarage"
      className={`tap inline-flex shrink-0 items-center gap-2.5 sm:gap-3 ${className}`.trim()}
    >
      <Logo variante="header" />
      <span className="font-display text-base font-bold uppercase leading-none tracking-tight text-cemento sm:text-lg">
        Moto<span className="text-brand">Garage</span>
      </span>
    </Link>
  );
}
