
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isEmailAuthorized, setIsEmailAuthorized] = useState(false);
  const captchaRef = useRef<any>(null);

  const { signUp } = useAuth();
  const { toast } = useToast();

  // Calcular si se puede enviar el formulario
  const canSubmit = isEmailAuthorized && 
                    fullName.trim().length >= 2 && 
                    password.length >= 6 && 
                    !!captchaToken &&
                    email.includes('@');

  const handleEmailAuthorizationChange = (authorized: boolean) => {
    console.log('Email authorization changed:', authorized);
    setIsEmailAuthorized(authorized);
  };

  const handleCaptchaVerify = (token: string) => {
    console.log('CAPTCHA verified, token received');
    setCaptchaToken(token);
  };

  const resetCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación explícita de autorización de email ANTES de intentar signup
    if (!isEmailAuthorized) {
      console.warn('Form submission blocked: email not authorized');
      toast({
        title: "Email no autorizado",
        description: "Tu email no está autorizado para registrarse. Contacta al administrador.",
        variant: "destructive"
      });
      return;
    }

    if (!canSubmit) {
      console.warn('Form submission blocked: not all requirements met');
      toast({
        title: "Formulario incompleto",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    if (!captchaToken) {
      console.warn('Form submission blocked: CAPTCHA token is missing');
      toast({
        title: "Verificación requerida",
        description: "Por favor completa la verificación CAPTCHA.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    console.log('Starting signup process with:', {
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      hasCaptcha: !!captchaToken,
      isEmailAuthorized,
      redirectUrl: `${window.location.origin}/auth?verified=true`
    });

    try {
      const result = await signUp(email, password, fullName, captchaToken);
      
      if (result.error) {
        console.error('Signup failed:', result.error);
        resetCaptcha();
      } else if (result.user) {
        console.log('Signup successful:', {
          userId: result.user.id,
          emailConfirmed: result.user.email_confirmed_at,
          needsConfirmation: !result.user.email_confirmed_at
        });
        
        if (!result.user.email_confirmed_at) {
          toast({
            title: "¡Cuenta creada exitosamente!",
            description: "Hemos enviado un enlace de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada (y la carpeta de spam) para verificar tu cuenta.",
            duration: 10000
          });
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Tu cuenta ha sido creada y verificada exitosamente.",
          });
        }
        resetCaptcha();
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error durante el registro. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      resetCaptcha();
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
    captchaRef,
    captchaToken,
    setCaptchaToken,
    canSubmit,
    handleSubmit,
    handleEmailAuthorizationChange,
    handleCaptchaVerify,
    resetCaptcha
  };
};
