'use client';

import { usePathname } from 'next/navigation';

/** Ri-anima un fade-in leggero ad ogni cambio route. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
