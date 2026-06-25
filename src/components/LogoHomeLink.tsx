'use client';

import Link from 'next/link';
import { homeHref } from '@/lib/home-href';
import Logo from '@/components/Logo';

interface Props {
  onClick?: () => void;
  className?: string;
  grande?: boolean;
}

/** Logo + nome in alto a sinistra — link pulito, scorre con la pagina. */
export default function LogoHomeLink({ onClick, className = '', grande = false }: Props) {
  const href = homeHref();

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Torna alla home MotoGarage"
      className={`tap inline-flex shrink-0 items-center gap-2.5 sm:gap-3 ${grande ? 'py-0.5' : ''} ${className}`.trim()}
    >
      <Logo variante={grande ? 'headerGrande' : 'header'} />
      <span
        className={`font-display font-bold uppercase leading-none tracking-tight text-cemento ${
          grande ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
        }`}
      >
        Moto<span className="text-brand">Garage</span>
      </span>
    </Link>
  );
}
