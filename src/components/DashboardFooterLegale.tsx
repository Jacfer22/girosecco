import Link from 'next/link';
import Logo from './Logo';
import { BRAND_DOMAIN, BRAND_EMAIL } from '@/lib/brand-display';

/** Footer legale in fondo al cockpit — fa comparire la bottom nav al scroll. */
export default function DashboardFooterLegale() {
  return (
    <footer id="app-scroll-end" className="dash-footer-legale mt-10 border-t border-white/10 pt-8">
      <Logo variante="footer" />
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-cemento/50">
        Traccia giri GPS, card social, garage 3D e community moto — tutto in un&apos;unica app.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cemento/35">App</p>
          <ul className="mt-2 space-y-2 font-mono text-[11px] uppercase tracking-wide">
            <li><Link href="/traccia" className="text-cemento/60 hover:text-brand">Traccia</Link></li>
            <li><Link href="/naviga" className="text-cemento/60 hover:text-brand">Navigatore</Link></li>
            <li><Link href="/itinerari" className="text-cemento/60 hover:text-brand">Itinerari</Link></li>
            <li><Link href="/garage" className="text-cemento/60 hover:text-brand">Garage</Link></li>
            <li><Link href="/community" className="text-cemento/60 hover:text-brand">Community</Link></li>
            <li><Link href="/pro" className="text-cemento/60 hover:text-brand">Pro</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cemento/35">Legale</p>
          <ul className="mt-2 space-y-2 font-mono text-[11px] uppercase tracking-wide">
            <li><Link href="/privacy" className="text-cemento/60 hover:text-brand">Privacy</Link></li>
            <li><Link href="/termini" className="text-cemento/60 hover:text-brand">Termini</Link></li>
            <li><Link href="/termini" className="text-cemento/60 hover:text-brand">Condizioni</Link></li>
            <li><a href={`mailto:${BRAND_EMAIL}`} className="text-cemento/60 hover:text-brand">Contatti</a></li>
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cemento/35">Account</p>
          <ul className="mt-2 space-y-2 font-mono text-[11px] uppercase tracking-wide">
            <li><Link href="/account" className="text-cemento/60 hover:text-brand">Profilo</Link></li>
            <li><Link href="/giri" className="text-cemento/60 hover:text-brand">I miei giri</Link></li>
            <li><Link href="/community/classifica" className="text-cemento/60 hover:text-brand">Classifica km</Link></li>
          </ul>
        </div>
      </div>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-wide text-cemento/35">
        © {new Date().getFullYear()} MotoGarage · {BRAND_DOMAIN}
      </p>
    </footer>
  );
}
