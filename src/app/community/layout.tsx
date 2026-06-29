'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CercaUtenti from '@/components/CercaUtenti';
import AppPageShell, { PageIntro } from '@/components/AppPageShell';

const TAB = [
  { href: '/community', label: 'Attività', match: (p: string) => p === '/community' },
  { href: '/community/classifica', label: 'Classifica km', match: (p: string) => p.startsWith('/community/classifica') },
];

export default function LayoutCommunity({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppPageShell atmosphere="glow">
      <PageIntro
        label="In sella ora"
        title="Community"
        description="Pubblica foto e giri, reagisci agli altri rider, scala la classifica km."
      />

      <div className="mt-6">
        <CercaUtenti />
      </div>

      <nav className="mt-6 flex gap-2 border-b border-white/10 pb-px" aria-label="Sezioni community">
        {TAB.map((tab) => {
          const attivo = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tap rounded-t-app px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide transition-colors ${
                attivo
                  ? 'border-b-2 border-brand bg-brand/10 text-brand'
                  : 'text-cemento/50 hover:text-cemento'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">{children}</div>
    </AppPageShell>
  );
}
