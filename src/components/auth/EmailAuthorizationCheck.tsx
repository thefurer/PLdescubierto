
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';

interface EmailAuthorizationCheckProps {
  email: string;
  onAuthorizationChecked: (isAuthorized: boolean) => void;
  children: React.ReactNode;
}

const EmailAuthorizationCheck = ({ email, onAuthorizationChecked, children }: EmailAuthorizationCheckProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { checkEmailAuthorization } = useAdminManagement();

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
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Verificando autorización del email...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isAuthorized === false && email && email.includes('@')) {
    return (
      <div>
        {children}
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Este email no está autorizado para registrarse. Contacta al administrador para solicitar acceso.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default EmailAuthorizationCheck;
