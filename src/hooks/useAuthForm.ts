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
        if (error.message.includes('captcha') || error.message.includes('sitekey-secret-mismatch')) {
          toast({
            title: "Error de configuración",
            description: "Hay un problema con la configuración de seguridad. Por favor intenta de nuevo en unos minutos.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
        options: {
          captchaToken: captchaToken
        }
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('captcha') || error.message.includes('sitekey-secret-mismatch')) {
          toast({
            title: "Error de verificación",
            description: "Hay un problema con la verificación de seguridad. Por favor recarga la página e intenta de nuevo.",
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
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente."
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

  const handleSignup = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.signUp({
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

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('captcha') || error.message.includes('sitekey-secret-mismatch')) {
          toast({
            title: "Error de configuración",
            description: "Hay un problema con la verificación de seguridad. Por favor recarga la página e intenta de nuevo.",
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
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
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
