
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const initializeAuth = async (
  mounted: boolean,
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
  retryCount: number = 0,
  maxRetries: number = 3
): Promise<void> => {
  try {
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Session initialization error:', error);
      // Clear potentially corrupted session only if it's a critical error
      if (error.message?.includes('invalid') || error.message?.includes('expired')) {
        console.log('Clearing corrupted session');
        await supabase.auth.signOut();
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      }
    } else if (mounted) {
      // Validate session before setting it
      if (currentSession && currentSession.access_token && currentSession.user) {
        console.log('Valid session found, setting state');
        setSession(currentSession);
        setUser(currentSession.user);
      } else if (currentSession) {
        console.warn('Invalid session structure, clearing');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
      } else {
        console.log('No session found');
        setSession(null);
        setUser(null);
      }
    }
  } catch (error) {
    console.error('Critical auth initialization error:', error);
    if (mounted) {
      setSession(null);
      setUser(null);
    }
    
    // Retry logic for network issues
    if (retryCount < maxRetries) {
      const newRetryCount = retryCount + 1;
      console.log(`Retrying auth initialization (${newRetryCount}/${maxRetries})`);
      setTimeout(() => initializeAuth(mounted, setSession, setUser, setLoading, newRetryCount, maxRetries), 1000 * newRetryCount);
      return;
    }
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
};
