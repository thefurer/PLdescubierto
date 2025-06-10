
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthErrorHandler } from '@/utils/authErrors';

export const usePasswordReset = () => {
  const { toast } = useToast();
  const { handleAuthError } = useAuthErrorHandler();

  const handlePasswordReset = async (
    email: string, 
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
        captchaToken: captchaToken
      });

      if (error) {
        handleAuthError(error, 'reset');
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

  const handlePasswordUpdate = async (newPassword: string, setLoading: (loading: boolean) => void) => {
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
    handlePasswordReset,
    handlePasswordUpdate
  };
};
