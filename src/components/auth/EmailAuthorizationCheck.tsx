
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useEmailAuthorization } from '@/hooks/useEmailAuthorization';

interface EmailAuthorizationCheckProps {
  email: string;
  onAuthorizationChecked: (isAuthorized: boolean) => void;
  children: React.ReactNode;
}

const EmailAuthorizationCheck = ({ 
  email, 
  onAuthorizationChecked, 
  children 
}: EmailAuthorizationCheckProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>('');
  const { checkEmailAuthorization } = useEmailAuthorization();

  useEffect(() => {
    const checkAuthorization = async () => {
      const cleanEmail = email.toLowerCase().trim();
      
      // Solo proceder si el email es válido
      if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
        if (isAuthorized !== null || lastCheckedEmail !== '') {
          console.log('Invalid email, resetting states');
          setIsAuthorized(null);
          setLastCheckedEmail('');
          onAuthorizationChecked(false);
        }
        return;
      }

      // Solo verificar si el email cambió
      if (cleanEmail === lastCheckedEmail) {
        return;
      }

      console.log('Email changed, checking authorization:', cleanEmail);
      setIsChecking(true);
      setLastCheckedEmail(cleanEmail);
      
      try {
        const authorized = await checkEmailAuthorization(cleanEmail);
        console.log('Authorization result for', cleanEmail, ':', authorized);
        
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

    // Debounce la verificación para evitar llamadas excesivas
    const timeoutId = setTimeout(checkAuthorization, 500);
    return () => clearTimeout(timeoutId);
  }, [email, checkEmailAuthorization, onAuthorizationChecked, lastCheckedEmail]);

  const renderStatusAlert = () => {
    const cleanEmail = email.toLowerCase().trim();
    
    // No mostrar nada si el email no es válido
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      return null;
    }

    if (isChecking) {
      return (
        <Alert className="mt-2 border-blue-200 bg-blue-50">
          <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription className="text-blue-800">
            Verificando autorización del email...
          </AlertDescription>
        </Alert>
      );
    }

    if (isAuthorized === true) {
      return (
        <Alert className="mt-2 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            ✓ Email autorizado. Puedes proceder con el registro.
          </AlertDescription>
        </Alert>
      );
    }

    if (isAuthorized === false) {
      return (
        <Alert className="mt-2 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            Este email no está autorizado para registrarse. Contacta al administrador para solicitar acceso.
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  return (
    <div>
      {children}
      {renderStatusAlert()}
    </div>
  );
};

export default EmailAuthorizationCheck;
