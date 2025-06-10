
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthErrorHandler } from '@/utils/authErrors';

export const useSignup = () => {
  const { toast } = useToast();
  const { handleAuthError } = useAuthErrorHandler();

  const handleSignup = async (
    email: string,
    password: string,
    fullName: string,
    captchaToken: string | null,
    resetCaptcha: () => void,
    setLoading: (loading: boolean) => void
  ) => {
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
        handleAuthError(error, 'signup');
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

  return { handleSignup };
};
