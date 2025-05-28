
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    captchaToken,
    setCaptchaToken,
    captcha,
    handlePasswordReset,
    handleLogin,
    handleSignup
  } = useAuthForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleFormSubmit = (e: React.FormEvent) => {
    if (isResetMode) {
      handlePasswordReset(e);
      setIsResetMode(false);
    } else if (isLogin) {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  const getTitle = () => {
    if (isResetMode) return 'Restablecer Contraseña';
    return isLogin ? 'Iniciar Sesión' : 'Crear Cuenta';
  };

  const getSubtitle = () => {
    if (isResetMode) return 'Ingresa tu email para restablecer tu contraseña';
    return isLogin ? 'Accede a tu cuenta' : 'Únete a Puerto López';
  };

  const renderForm = () => {
    if (isResetMode) {
      return (
        <PasswordResetForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          onSubmit={handleFormSubmit}
          onBackToLogin={() => setIsResetMode(false)}
        />
      );
    }

    if (isLogin) {
      return (
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          onSubmit={handleFormSubmit}
          onForgotPassword={() => setIsResetMode(true)}
        />
      );
    }

    return (
      <SignupForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        loading={loading}
        captchaToken={captchaToken}
        setCaptchaToken={setCaptchaToken}
        captcha={captcha}
        onSubmit={handleFormSubmit}
      />
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-light to-blue-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-ocean-dark">
            {getTitle()}
          </h2>
          <p className="mt-2 text-gray-600">
            {getSubtitle()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl border border-white/30 p-8">
          {renderForm()}

          {!isResetMode && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-ocean hover:text-ocean-dark transition-colors"
              >
                {isLogin ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Iniciar sesión'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
