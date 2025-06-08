
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Check for URL parameters
  const mode = searchParams.get('mode');
  const verified = searchParams.get('verified');
  const isPasswordReset = mode === 'reset';
  const isEmailVerified = verified === 'true';

  // Handle password recovery tokens from URL hash
  useEffect(() => {
    const handleRecoveryToken = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token') && hash.includes('type=recovery')) {
        try {
          // Extract tokens from hash
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            // Set the session with the recovery tokens
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (!error) {
              // Clear the hash and redirect to password reset mode
              window.history.replaceState({}, document.title, '/auth?mode=reset');
              window.location.reload();
            }
          }
        } catch (error) {
          console.error('Error handling recovery token:', error);
        }
      }
    };

    handleRecoveryToken();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isPasswordReset) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, isPasswordReset]);

  const getTitle = () => {
    if (isPasswordReset) return 'Actualizar Contraseña';
    if (isEmailVerified) return 'Email Verificado';
    if (isResetMode) return 'Restablecer Contraseña';
    return isLogin ? 'Iniciar Sesión' : 'Crear Cuenta';
  };

  const getSubtitle = () => {
    if (isPasswordReset) return 'Ingresa tu nueva contraseña';
    if (isEmailVerified) return 'Tu email ha sido verificado exitosamente';
    if (isResetMode) return 'Ingresa tu email para restablecer tu contraseña';
    return isLogin ? 'Accede a tu cuenta' : 'Únete a Puerto López';
  };

  const handleBackToLogin = () => {
    if (isPasswordReset || isEmailVerified) {
      navigate('/auth');
    } else {
      setIsResetMode(false);
    }
  };

  return {
    isLogin,
    setIsLogin,
    isResetMode,
    setIsResetMode,
    isPasswordReset,
    isEmailVerified,
    getTitle,
    getSubtitle,
    handleBackToLogin
  };
};
