
import { CheckCircle, Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface EmailConfirmationStatusProps {
  email?: string;
  isVerified?: boolean;
  onContinue?: () => void;
}

export const EmailConfirmationStatus = ({ 
  email, 
  isVerified = false,
  onContinue
}: EmailConfirmationStatusProps) => {
  const [isResending, setIsResending] = useState(false);
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Email requerido",
        description: "No se puede reenviar sin una dirección de email.",
        variant: "destructive"
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await resendConfirmation(email);
      if (!error) {
        toast({
          title: "Email reenviado",
          description: "Hemos reenviado el enlace de confirmación a tu correo."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reenviar el email. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-ocean-dark mb-2">
            ¡Email Verificado!
          </h2>
          <p className="text-gray-600">
            Tu email ha sido verificado exitosamente. Ya puedes acceder a todas las funciones de tu cuenta.
          </p>
        </div>
        {onContinue && (
          <Button 
            onClick={onContinue}
            className="bg-ocean hover:bg-ocean-dark"
            size="lg"
          >
            Continuar a la aplicación
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <CardTitle className="text-xl text-ocean-dark">
          Confirma tu dirección de email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Hemos enviado un enlace de confirmación a:
          </p>
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <code className="text-ocean font-medium">{email}</code>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Instrucciones:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Revisa tu bandeja de entrada</li>
            <li>Busca el email de Puerto López</li>
            <li>Haz clic en el enlace de confirmación</li>
            <li>Regresa aquí para iniciar sesión</li>
          </ol>
        </div>

        <div className="space-y-3">
          <Button 
            variant="outline" 
            onClick={handleResendEmail}
            disabled={isResending || !email}
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Reenviando...
              </>
            ) : (
              'Reenviar email de confirmación'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            ¿No encuentras el email? Revisa tu carpeta de spam o correo no deseado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
