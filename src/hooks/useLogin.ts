
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
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);

    try {
      console.log('Login attempt with captcha token:', captchaToken ? 'present' : 'missing');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
        options: {
          captchaToken: captchaToken || undefined
        }
      });

      if (error) {
        console.error('Login error:', error);
        handleAuthError(error, 'login');
      } else if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente."
        });
        // Redirigir a la página principal
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin };
};
