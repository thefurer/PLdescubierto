import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string, captchaToken?: string) => Promise<{ user: User | null; error: AuthError | null }>;
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
    let retryCount = 0;
    const maxRetries = 3;

    // Initialize auth state with improved error handling
    const initializeAuth = async () => {
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
          retryCount++;
          console.log(`Retrying auth initialization (${retryCount}/${maxRetries})`);
          setTimeout(initializeAuth, 1000 * retryCount);
          return;
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener with better error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, captchaToken?: string) => {
    try {
      console.log('Starting signup process for:', email);
      console.log('CAPTCHA token provided:', !!captchaToken);
      
      const signUpOptions: any = {
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
        },
      };

      // Add CAPTCHA token if provided
      if (captchaToken) {
        signUpOptions.options.captchaToken = captchaToken;
        console.log('CAPTCHA token added to signup options');
      }

      const { data, error } = await supabase.auth.signUp(signUpOptions);

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: 'Error al registrarse',
          description: error.message,
          variant: 'destructive',
        });
      } else if (data.user) {
        console.log('Signup successful:', data.user.id);
        if (!data.user.email_confirmed_at) {
          toast({
            title: 'Confirmación requerida',
            description: 'Por favor verifica tu email antes de iniciar sesión.',
          });
        } else {
          toast({
            title: 'Cuenta creada',
            description: 'Tu cuenta ha sido creada exitosamente.',
          });
        }
      }

      return { user: data.user, error };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: 'Error al registrarse',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { user: null, error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email o contraseña incorrectos';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor verifica tu email antes de iniciar sesión';
        }
        
        toast({
          title: 'Error al iniciar sesión',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        console.log('Signin successful');
        toast({
          title: 'Bienvenido',
          description: 'Has iniciado sesión correctamente.',
        });
      }

      return { user: data.user, error };
    } catch (error: any) {
      console.error('Unexpected signin error:', error);
      toast({
        title: 'Error al iniciar sesión',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { user: null, error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Signout error:', error);
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
      console.error('Unexpected signout error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al cerrar sesión.',
        variant: 'destructive',
      });
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase().trim(),
        {
          redirectTo: `${window.location.origin}/auth?mode=update-password`,
        }
      );

      if (error) {
        console.error('Reset password error:', error);
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
      console.error('Unexpected reset password error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { error: error as AuthError };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Update password error:', error);
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
      console.error('Unexpected update password error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { error: error as AuthError };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.toLowerCase().trim(),
      });

      if (error) {
        console.error('Resend confirmation error:', error);
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
      console.error('Unexpected resend confirmation error:', error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado. Intenta de nuevo.',
        variant: 'destructive',
      });
      return { error: error as AuthError };
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
