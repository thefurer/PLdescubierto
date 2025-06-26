import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthService = () => {
  const { toast } = useToast();

  const signUp = async (email: string, password: string, fullName?: string, captchaToken?: string) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const trimmedFullName = fullName?.trim() || '';
      
      console.log('Starting signup process for:', {
        email: normalizedEmail,
        fullName: trimmedFullName,
        captchaProvided: !!captchaToken
      });
      
      const redirectUrl = `${window.location.origin}/auth?verified=true`;
      console.log('Using redirect URL:', redirectUrl);
      
      const signUpOptions: any = {
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: trimmedFullName,
          },
          emailRedirectTo: redirectUrl,
        },
      };

      // Add CAPTCHA token if provided
      if (captchaToken) {
        signUpOptions.options.captchaToken = captchaToken;
        console.log('CAPTCHA token added to signup options');
      }

      console.log('Calling Supabase signUp with options:', {
        email: signUpOptions.email,
        hasPassword: !!password,
        redirectTo: signUpOptions.options.emailRedirectTo,
        hasCaptcha: !!signUpOptions.options.captchaToken,
        userData: signUpOptions.options.data
      });

      const { data, error } = await supabase.auth.signUp(signUpOptions);

      console.log('Supabase signUp response:', {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          createdAt: data.user.created_at
        } : null,
        session: data.session ? 'Session created' : 'No session',
        error: error ? error.message : null
      });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        let errorMessage = error.message;
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'El formato del email no es válido.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else if (error.message.includes('captcha')) {
          errorMessage = 'Error en la verificación CAPTCHA. Por favor intenta de nuevo.';
        } else if (error.message.includes('Email rate limit')) {
          errorMessage = 'Demasiados intentos. Por favor espera un momento antes de intentar de nuevo.';
        }
        
        toast({
          title: 'Error al registrarse',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (data.user) {
        console.log('Signup successful for user:', data.user.id);
        
        // No mostrar toast aquí, se manejará en el hook que llama esta función
        if (!data.user.email_confirmed_at) {
          console.log('Email confirmation required - email should be sent to:', data.user.email);
        } else {
          console.log('Email already confirmed for user:', data.user.id);
        }
      }

      return { user: data.user, error };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast({
        title: 'Error al registrarse',
        description: 'Ocurrió un error inesperado. Por favor verifica tu conexión a internet e intenta de nuevo.',
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
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verified=true`
        }
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
