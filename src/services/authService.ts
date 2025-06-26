
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthService = () => {
  const { toast } = useToast();

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

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
  };
};
