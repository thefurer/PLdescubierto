
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEmailAuthorization } from '@/hooks/useEmailAuthorization';

interface EmailAuthorizationCheckProps {
  email: string;
  onAuthorizationChecked: (isAuthorized: boolean) => void;
  children: React.ReactNode;
}

const EmailAuthorizationCheck = ({ email, onAuthorizationChecked, children }: EmailAuthorizationCheckProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { checkEmailAuthorization } = useEmailAuthorization();

  useEffect(() => {
    const checkAuthorization = async () => {
      // Resetear estados
      setIsAuthorized(null);
      onAuthorizationChecked(false);

      // Validar email básico
      if (!email || !email.includes('@') || email.length < 5) {
        return;
      }

      setIsChecking(true);
      
      try {
        console.log('Starting email authorization check for:', email);
        const authorized = await checkEmailAuthorization(email);
        console.log('Email authorization check completed:', { email, authorized });
        
        setIsAuthorized(authorized);
        onAuthorizationChecked(authorized);
      } catch (error) {
        console.error('Error checking email authorization:', error);
        setIsAuthorized(false);
        onAuthorizationChecked(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce la verificación
    const timeoutId = setTimeout(checkAuthorization, 500);
    return () => clearTimeout(timeoutId);
  }, [email, checkEmailAuthorization, onAuthorizationChecked]);

  // Mostrar el campo de email siempre
  const renderContent = () => {
    if (!email || !email.includes('@') || email.length < 5) {
      return <>{children}</>;
    }

    if (isChecking) {
      return (
        <div>
          {children}
          <Alert className="mt-2 border-blue-200 bg-blue-50">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription className="text-blue-800">
              Verificando autorización del email...
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (isAuthorized === true) {
      return (
        <div>
          {children}
          <Alert className="mt-2 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              ✓ Email autorizado. Puedes proceder con el registro.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (isAuthorized === false) {
      return (
        <div>
          {children}
          <Alert className="mt-2 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              Este email no está autorizado para registrarse. Contacta al administrador para solicitar acceso.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return <>{children}</>;
  };

  return renderContent();
};

export default EmailAuthorizationCheck;
