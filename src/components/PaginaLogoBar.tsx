'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { chromeMobileNascosto } from '@/lib/chrome-app';
import LogoHomeLink from '@/components/LogoHomeLink';

/**
 * Logo in cima al contenuto quando l'header è nascosto (mobile app).
 * Scorre con la pagina — niente position fixed.
 */
export default function PaginaLogoBar() {
  const pathname = usePathname();
  const { user, loading, nonConfigurato } = useAuth();
  const loggato = !loading && !!user && !nonConfigurato;
  const [mostra, setMostra] = useState(false);

  useEffect(() => {
    const aggiorna = () => {
      if (pathname.startsWith('/reel')) {
        setMostra(false);
        return;
      }
      if (document.body.classList.contains('nav-fullscreen-active')) {
        setMostra(false);
        return;
      }
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      setMostra(mobile && chromeMobileNascosto(pathname, loggato));
    };

    aggiorna();
    window.addEventListener('resize', aggiorna);
    const obs = new MutationObserver(aggiorna);
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('resize', aggiorna);
      obs.disconnect();
    };
  }, [pathname, loggato]);

  if (!mostra) return null;

  return (
    <div className="pagina-logo-bar w-full pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
      <LogoHomeLink />
    </div>
  );
}
