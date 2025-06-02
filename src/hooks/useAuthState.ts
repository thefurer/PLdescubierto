
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
