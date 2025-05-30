
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailVerificationStatusProps {
  verified?: boolean;
  title?: string;
  message?: string;
  onResendEmail?: () => void;
  loading?: boolean;
}

export const EmailVerificationStatus = ({ 
  verified = false, 
  title,
  message,
  onResendEmail,
  loading = false
}: EmailVerificationStatusProps) => {
  const defaultTitle = verified ? '¡Email Verificado!' : 'Verificación de Email Requerida';
  const defaultMessage = verified 
    ? 'Tu email ha sido verificado exitosamente. Ya puedes iniciar sesión.'
    : 'Hemos enviado un enlace de verificación a tu correo electrónico. Por favor revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.';

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {verified ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <Mail className="h-16 w-16 text-blue-500" />
          )}
        </div>
        <CardTitle className="text-xl text-ocean-dark">
          {title || defaultTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          {message || defaultMessage}
        </p>
        
        {!verified && onResendEmail && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              ¿No recibiste el email?
            </p>
            <Button 
              variant="outline" 
              onClick={onResendEmail}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Enviando...' : 'Reenviar email de verificación'}
            </Button>
          </div>
        )}

        {!verified && (
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Revisa tu carpeta de spam</p>
              <p>Si no encuentras el email, revisa tu carpeta de correo no deseado.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
