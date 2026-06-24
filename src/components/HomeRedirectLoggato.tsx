'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

/** Loggati: la landing marketing resta solo per ospiti → hub cockpit. */
export default function HomeRedirectLoggato() {
  const { user, loading, nonConfigurato } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !nonConfigurato) {
      router.replace('/hub');
    }
  }, [loading, user, nonConfigurato, router]);

  return null;
}
