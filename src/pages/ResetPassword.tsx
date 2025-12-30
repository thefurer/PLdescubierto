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
        console.log('=== RESET PASSWORD: Checking session ===');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', Object.fromEntries(searchParams.entries()));
        console.log('URL hash:', window.location.hash);

        // Supabase puede enviar tokens en el hash fragment (#) o como query params
        // Parseamos ambos formatos
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const accessToken = searchParams.get('access_token') || hashParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') || hashParams.get('refresh_token');
        const type = searchParams.get('type') || hashParams.get('type');
        const tokenHash = searchParams.get('token_hash') || hashParams.get('token_hash');
        
        console.log('Parsed tokens:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          hasTokenHash: !!tokenHash,
          type 
        });

        // Si tenemos access_token y refresh_token, configurar la sesión directamente
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('Setting session from tokens...');
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (setSessionError) {
            console.error('Error setting session:', setSessionError);
            setError('El enlace de restablecimiento ha expirado o es inválido. Por favor, solicita uno nuevo.');
            setLoading(false);
            return;
          }
          
          if (data?.session) {
            console.log('Session set successfully from tokens');
            setIsValidSession(true);
            setLoading(false);
            // Limpiar el hash de la URL
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }

        // Si tenemos token_hash, usar verifyOtp
        if (tokenHash && type === 'recovery') {
          console.log('Verifying OTP with token_hash...');
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery'
          });
          
          if (verifyError) {
            console.error('Verify OTP error:', verifyError);
            setError('El enlace de restablecimiento ha expirado o es inválido. Por favor, solicita uno nuevo.');
            setLoading(false);
            return;
          }
          
          console.log('OTP verified successfully');
          setIsValidSession(true);
          setLoading(false);
          return;
        }

        // Check if we have an existing session (could be from Supabase auto-handling)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('Existing session check:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          sessionError 
        });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Error al verificar la sesión. Por favor, solicita un nuevo enlace de restablecimiento.');
          setLoading(false);
          return;
        }

        // Si ya tenemos una sesión activa, es válida para cambiar contraseña
        if (session?.user) {
          console.log('Valid existing session found');
          setIsValidSession(true);
        } else {
          console.log('No valid session found');
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
