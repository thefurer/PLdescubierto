
import { useToast } from '@/hooks/use-toast';

export const useAuthErrorHandler = () => {
  const { toast } = useToast();

  const handleAuthError = (error: any, operation: 'login' | 'signup' | 'reset') => {
    console.error(`${operation} error:`, error);
    
    // Manejo específico de errores de HCaptcha
    if (error.message.includes('captcha')) {
      toast({
        title: "Error de verificación",
        description: "Error en la verificación CAPTCHA. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      return;
    }

    switch (operation) {
      case 'login':
        handleLoginError(error, toast);
        break;
      case 'signup':
        handleSignupError(error, toast);
        break;
      case 'reset':
        handleResetError(error, toast);
        break;
    }
  };

  return { handleAuthError };
};

const handleLoginError = (error: any, toast: any) => {
  if (error.message.includes('Invalid login credentials')) {
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
};

const handleSignupError = (error: any, toast: any) => {
  if (error.message.includes('User already registered')) {
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
};

const handleResetError = (error: any, toast: any) => {
  toast({
    title: "Error",
    description: "No se pudo enviar el email de restablecimiento. Intenta de nuevo.",
    variant: "destructive"
  });
};
