
import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthProviderProps } from '@/types/auth-context';
import { useAuthService } from '@/services/authService';
import { initializeAuth } from '@/utils/authInitialization';
import { handleAuthStateChange } from '@/utils/authStateHandler';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authService = useAuthService();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener with better error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      await handleAuthStateChange(event, session, mounted, setSession, setUser, setLoading);
    });

    // Initialize auth state
    initializeAuth(mounted, setSession, setUser, setLoading);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut,
    resetPassword: authService.resetPassword,
    updatePassword: authService.updatePassword,
    resendConfirmation: authService.resendConfirmation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
