
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthErrorHandler } from '@/utils/authErrors';

export const useLogin = () => {
  const { toast } = useToast();
  const { handleAuthError } = useAuthErrorHandler();

  const handleLogin = async (
    email: string,
    password: string,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);

    try {
      // Intentar login sin CAPTCHA primero
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        // Si el error es específicamente de CAPTCHA, mostrar mensaje personalizado
        if (error.message.includes('captcha verification process failed')) {
          toast({
            title: "Error de configuración",
            description: "Hay un problema con la configuración del servidor. Por favor contacta al administrador.",
            variant: "destructive"
          });
        } else {
          handleAuthError(error, 'login');
        }
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
