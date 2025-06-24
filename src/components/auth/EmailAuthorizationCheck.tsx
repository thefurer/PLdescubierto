
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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
      if (!email || !email.includes('@')) {
        setIsAuthorized(null);
        onAuthorizationChecked(false);
        return;
      }

      setIsChecking(true);
      try {
        const authorized = await checkEmailAuthorization(email);
        console.log('Email authorization result:', { email, authorized });
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

    const timeoutId = setTimeout(checkAuthorization, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [email, checkEmailAuthorization, onAuthorizationChecked]);

  if (isChecking) {
    return (
      <div>
        {children}
        <Alert className="mt-2 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Verificando autorización del email...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isAuthorized === true && email && email.includes('@')) {
    return (
      <div>
        {children}
        <Alert className="mt-2 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ✓ Email autorizado. Puedes proceder con el registro.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isAuthorized === false && email && email.includes('@')) {
    return (
      <div>
        {children}
        <Alert className="mt-2 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Este email no está autorizado para registrarse. Contacta al administrador para solicitar acceso.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default EmailAuthorizationCheck;
