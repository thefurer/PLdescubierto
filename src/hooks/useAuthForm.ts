
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  const captcha = useRef<HCaptcha>(null);

  const resetCaptcha = () => {
    if (captcha.current) {
      captcha.current.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!captchaToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación CAPTCHA.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
        captchaToken: captchaToken
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar el email de restablecimiento. Intenta de nuevo.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu correo electrónico."
        });
      }

      resetCaptcha();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive"
      });
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!captchaToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación CAPTCHA.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
        options: {
          captchaToken: captchaToken
        }
      });

      if (error) {
        console.error('Login error:', error);
        
        // Manejo específico de errores de HCaptcha
        if (error.message.includes('captcha')) {
          toast({
            title: "Error de verificación",
            description: "Error en la verificación CAPTCHA. Por favor intenta de nuevo.",
            variant: "destructive"
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Error de inicio de sesión",
            description: "Credenciales inválidas. Verifica tu email y contraseña.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email no verificado",
            description: "Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error de inicio de sesión",
            description: `No se pudo iniciar sesión: ${error.message}`,
            variant: "destructive"
          });
        }
      } else if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente."
        });
        // Redirigir a la página principal
        window.location.href = '/';
      }

      resetCaptcha();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive"
      });
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Iniciando registro con:', { email, captchaToken: !!captchaToken });

    if (!captchaToken) {
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación CAPTCHA.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim()
          },
          captchaToken: captchaToken,
          emailRedirectTo: `${window.location.origin}/auth?verified=true`
        }
      });

      console.log('Respuesta de registro:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        
        // Manejo específico de errores de HCaptcha
        if (error.message.includes('captcha')) {
          toast({
            title: "Error de verificación",
            description: "Error en la verificación CAPTCHA. Por favor intenta de nuevo.",
            variant: "destructive"
          });
        } else if (error.message.includes('User already registered')) {
          toast({
            title: "Usuario ya registrado",
            description: "Este email ya está registrado. Intenta iniciar sesión.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error de registro",
            description: `No se pudo crear la cuenta: ${error.message}`,
            variant: "destructive"
          });
        }
      } else if (data.user) {
        toast({
          title: "¡Cuenta creada!",
          description: "Hemos enviado un enlace de verificación a tu correo. Por favor verifica tu email antes de iniciar sesión.",
          duration: 10000
        });
      }

      resetCaptcha();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive"
      });
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return false;
      } else {
        toast({
          title: "Contraseña actualizada",
          description: "Tu contraseña ha sido actualizada exitosamente. Redirigiendo al inicio..."
        });
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        
        return true;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    captchaToken,
    setCaptchaToken,
    captcha,
    handlePasswordReset,
    handleLogin,
    handleSignup,
    handlePasswordUpdate
  };
};
