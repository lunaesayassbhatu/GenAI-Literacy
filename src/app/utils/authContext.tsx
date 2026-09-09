import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { hydrateLocalStorageFromSupabase } from './migrateToSupabase';
import { checkDailyCheckIn } from './userData';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // On startup, if a session already exists (user didn't go through login),
  // pull fresh data from Supabase into localStorage once per session.
  useEffect(() => {
    if (!session?.user) return;
    const alreadyHydrated = localStorage.getItem('hydrated_session') === session.user.id;
    if (alreadyHydrated) return;

    hydrateLocalStorageFromSupabase(session.user.id, session.user.email ?? '').then(() => {
      localStorage.setItem('hydrated_session', session.user.id);
      checkDailyCheckIn();
    });
  }, [session?.user?.id]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
