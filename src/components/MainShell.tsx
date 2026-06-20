'use client';

import { usePathname } from 'next/navigation';

const PAGINE_IMMERSIVE = ['/naviga', '/traccia'];

export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const immersivo = PAGINE_IMMERSIVE.some((p) => pathname.startsWith(p));

  return (
    <main className={immersivo ? 'main-immersivo flex-1' : 'flex-1'}>{children}</main>
  );
}
