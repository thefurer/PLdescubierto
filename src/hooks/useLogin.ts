
import { supabaseAuth } from '@/integrations/supabase/client';
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
      // Usar cliente especial sin CAPTCHA para login
      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
        options: {
          captchaToken: undefined
        }
      });

      if (error) {
        // Si aún hay error de CAPTCHA, intentar con método alternativo
        if (error.message.includes('captcha')) {
          toast({
            title: "Error de configuración",
            description: "El sistema requiere verificación adicional. Por favor contacta al administrador.",
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
