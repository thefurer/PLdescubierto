
import { CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthCard } from './AuthCard';
import { AuthHeader } from './AuthHeader';

interface EmailConfirmationStatusProps {
  isVerified: boolean;
  onContinue?: () => void;
  onResendEmail?: () => void;
}

export const EmailConfirmationStatus = ({
  isVerified,
  onContinue,
  onResendEmail
}: EmailConfirmationStatusProps) => {
  if (isVerified) {
    return (
      <AuthCard>
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <AuthHeader
            title="¡Email Verificado!"
            subtitle="Tu cuenta ha sido verificada exitosamente"
          />
          <Button onClick={onContinue} className="w-full">
            Continuar a la aplicación
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="text-center space-y-4">
        <Mail className="mx-auto h-12 w-12 text-blue-600" />
        <AuthHeader
          title="Verifica tu Email"
          subtitle="Hemos enviado un enlace de verificación a tu correo electrónico"
        />
        <p className="text-sm text-gray-600">
          Revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
        </p>
        {onResendEmail && (
          <Button variant="outline" onClick={onResendEmail} className="w-full">
            Reenviar email de verificación
          </Button>
        )}
      </div>
    </AuthCard>
  );
};
