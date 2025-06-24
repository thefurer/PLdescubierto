
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Clear any potentially corrupted session data
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error getting session:', error);
          // Clear potentially corrupted session
          await supabase.auth.signOut();
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        } else if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (!mounted) return;

      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
        },
      });

      if (error) {
        toast({
          title: 'Error al registrarse',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Confirmación requerida',
          description: 'Por favor verifica tu email antes de iniciar sesión.',
        });
      }

      return { user: data.user, error };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Error al registrarse',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { user: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'Error al iniciar sesión',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Bienvenido',
          description: 'Has iniciado sesión correctamente.',
        });
      }

      return { user: data.user, error };
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error al iniciar sesión',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Sesión cerrada',
          description: 'Has cerrado sesión correctamente.',
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al cerrar sesión.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=update-password`,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Email enviado',
          description: 'Revisa tu email para restablecer tu contraseña.',
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Contraseña actualizada',
          description: 'Tu contraseña ha sido actualizada correctamente.',
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Email reenviado',
          description: 'Hemos reenviado el email de confirmación.',
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
