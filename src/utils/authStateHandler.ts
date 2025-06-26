
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const handleAuthStateChange = async (
  event: string,
  session: Session | null,
  mounted: boolean,
  setSession: (session: Session | null) => void,
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  console.log('Auth state change event:', event);
  
  if (!mounted) return;

  try {
    if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed successfully');
      if (session && session.access_token && session.user) {
        setSession(session);
        setUser(session.user);
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      setSession(null);
      setUser(null);
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in');
      if (session && session.access_token && session.user) {
        setSession(session);
        setUser(session.user);
      }
    } else if (event === 'USER_UPDATED') {
      console.log('User updated');
      if (session && session.user) {
        setSession(session);
        setUser(session.user);
      }
    }

    // Handle session validation for all events
    if (session) {
      // Check if token is expired (add 30 second buffer)
      const now = Math.floor(Date.now() / 1000);
      const tokenExp = session.expires_at || 0;
      
      if (tokenExp > 0 && tokenExp < (now + 30)) {
        console.log('Token about to expire, refreshing...');
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error('Token refresh failed:', error);
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          } else if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
          }
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
        }
      }
    }

    setLoading(false);
  } catch (error) {
    console.error('Auth state change error:', error);
    setLoading(false);
  }
};
