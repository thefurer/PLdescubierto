import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { PasswordUpdateForm } from '@/components/auth/PasswordUpdateForm';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Error al verificar la sesión. Por favor, solicita un nuevo enlace de restablecimiento.');
          setLoading(false);
          return;
        }

        // Check if we have access_token and type=recovery in URL (from email link)
        const accessToken = searchParams.get('access_token');
        const type = searchParams.get('type');
        
        if (type === 'recovery' && accessToken) {
          // Exchange the token for a session
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: accessToken,
            type: 'recovery'
          });
          
          if (verifyError) {
            console.error('Verify error:', verifyError);
            setError('El enlace de restablecimiento ha expirado o es inválido. Por favor, solicita uno nuevo.');
            setLoading(false);
            return;
          }
          
          setIsValidSession(true);
          setLoading(false);
          return;
        }

        // Check if there's an active recovery session
        if (session?.user) {
          setIsValidSession(true);
        } else {
          setError('No se encontró una sesión válida. Por favor, solicita un nuevo enlace de restablecimiento.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [searchParams]);

  const handlePasswordUpdate = async (newPassword: string): Promise<boolean> => {
    setUpdating(true);
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
      }

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente."
      });

      // Redirect to home after success
      setTimeout(() => {
        navigate('/');
      }, 2000);

      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña. Intenta de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AuthContainer>
        <AuthCard>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Verificando sesión...</p>
          </div>
        </AuthCard>
      </AuthContainer>
    );
  }

  if (error) {
    return (
      <AuthContainer>
        <AuthCard>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <AuthHeader
              title="Error"
              subtitle={error}
            />
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Volver al inicio de sesión
            </Button>
          </div>
        </AuthCard>
      </AuthContainer>
    );
  }

  if (!isValidSession) {
    return (
      <AuthContainer>
        <AuthCard>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-warning" />
            <AuthHeader
              title="Sesión no válida"
              subtitle="Por favor, solicita un nuevo enlace de restablecimiento de contraseña."
            />
            <Button onClick={() => navigate('/auth')} className="mt-4">
              Volver al inicio de sesión
            </Button>
          </div>
        </AuthCard>
      </AuthContainer>
    );
  }

  return (
    <AuthContainer>
      <PasswordUpdateForm
        loading={updating}
        onSubmit={handlePasswordUpdate}
      />
    </AuthContainer>
  );
};

export default ResetPassword;
