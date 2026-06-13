'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface AuthState {
  user: User | null;
  loading: boolean;
  // true se le variabili NEXT_PUBLIC_SUPABASE_* non sono configurate
  nonConfigurato: boolean;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  nonConfigurato: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [stato, setStato] = useState<AuthState>({
    user: null,
    loading: true,
    nonConfigurato: false,
  });

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setStato({ user: null, loading: false, nonConfigurato: true });
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setStato({ user: data.session?.user ?? null, loading: false, nonConfigurato: false });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      setStato({ user: session?.user ?? null, loading: false, nonConfigurato: false });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={stato}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
