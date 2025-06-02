
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthForm } from '@/hooks/useAuthForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { PasswordUpdateForm } from '@/components/auth/PasswordUpdateForm';
import { EmailVerificationStatus } from '@/components/auth/EmailVerificationStatus';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
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
    handleSignup,
    handlePasswordUpdate
  } = useAuthForm();

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

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email para reenviar la verificación.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verified=true`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email reenviado",
          description: "Hemos reenviado el enlace de verificación a tu correo."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reenviar el email. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

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

  const renderForm = () => {
    if (isEmailVerified) {
      return (
        <EmailVerificationStatus
          verified={true}
          onResendEmail={undefined}
        />
      );
    }

    if (isPasswordReset) {
      return (
        <PasswordUpdateForm
          loading={loading}
          onSubmit={handlePasswordUpdate}
        />
      );
    }

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
          captchaToken={captchaToken}
          setCaptchaToken={setCaptchaToken}
          captcha={captcha}
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background with Gradient */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Ocean Wave Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" opacity="0.1"/>
          <path d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z" fill="white" opacity="0.05"/>
        </svg>
      </div>

      <div className="max-w-md w-full space-y-8 px-4 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            {getTitle()}
          </h2>
          <p className="mt-2 text-white/90 drop-shadow-md">
            {getSubtitle()}
          </p>
        </div>

        {/* Enhanced Glass Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl animate-scale-in">
          {renderForm()}

          {!isResetMode && !isPasswordReset && !isEmailVerified && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-ocean hover:text-ocean-dark smooth-transition font-medium"
              >
                {isLogin ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Iniciar sesión'}
              </button>
            </div>
          )}

          {(isEmailVerified || isPasswordReset) && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  navigate('/auth');
                }}
                className="text-ocean hover:text-ocean-dark smooth-transition font-medium"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>

        {/* Background Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-ocean/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Auth;
