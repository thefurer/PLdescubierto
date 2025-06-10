
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthErrorHandler } from '@/utils/authErrors';

export const useLogin = () => {
  const { toast } = useToast();
  const { handleAuthError } = useAuthErrorHandler();

  const handleLogin = async (
    email: string,
    password: string,
    captchaToken: string | null,
    resetCaptcha: () => void,
    setLoading: (loading: boolean) => void
  ) => {
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
        handleAuthError(error, 'login');
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

  return { handleLogin };
};
