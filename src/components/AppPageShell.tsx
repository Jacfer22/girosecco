import type { ReactNode } from 'react';
import { CINEMATIC, type CinematicAsset } from '@/lib/cinematic-assets';

export type PageAtmosphere = 'traccia' | 'nav' | 'garage' | 'card' | 'glow';

const ATMOSPHERE_BG: Record<PageAtmosphere, CinematicAsset | null> = {
  traccia: CINEMATIC.traccia,
  nav: CINEMATIC.navigazione,
  garage: CINEMATIC.garage,
  card: CINEMATIC.card,
  glow: null,
};

interface ShellProps {
  children: ReactNode;
  className?: string;
  width?: 'narrow' | 'wide' | 'full';
  immersive?: boolean;
  /** Atmosfera leggera — glow = solo bagliore, senza foto */
  atmosphere?: PageAtmosphere;
}

const WIDTH: Record<NonNullable<ShellProps['width']>, string> = {
  narrow: 'mx-auto max-w-2xl',
  wide: 'mx-auto max-w-6xl',
  full: '',
};

export default function AppPageShell({
  children,
  className = '',
  width = 'narrow',
  immersive = false,
  atmosphere,
}: ShellProps) {
  const base = immersive ? '' : 'app-pagina';
  const bg = atmosphere ? ATMOSPHERE_BG[atmosphere] : null;
  const cinematic = atmosphere
    ? `app-pagina-cinematic ${atmosphere === 'glow' ? 'app-pagina-cinematic-glow' : 'app-pagina-cinematic-foto'}`
    : '';

  return (
    <div
      className={`${base} ${cinematic} ${WIDTH[width]} px-4 pt-6 pb-6 ${className}`.trim()}
      style={bg ? { ['--page-accent-bg' as string]: `url("${bg}")` } : undefined}
    >
      {children}
    </div>
  );
}

interface IntroProps {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageIntro({ label, title, description, children, className = '' }: IntroProps) {
  return (
    <header className={`page-intro ${className}`}>
      <p className="page-intro-label">{label}</p>
      <h1 className="page-intro-title">{title}</h1>
      {description && <p className="page-intro-desc">{description}</p>}
      {children}
    </header>
  );
}
