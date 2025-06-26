
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { AuthFormRenderer } from '@/components/auth/AuthFormRenderer';
import { useAuthForm } from '@/hooks/useAuthForm';

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
    handleLoginSubmit,
    handleSignupSubmit,
    handleResetSubmit,
    resetCaptcha
  } = useAuthForm();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const verified = searchParams.get('verified');
    const reset = searchParams.get('reset');
    
    if (verified === 'true') {
      setIsEmailVerified(true);
    }
    
    if (reset === 'true') {
      setIsPasswordReset(true);
    }
  }, [searchParams]);

  const handleFormSubmit = (e: React.FormEvent) => {
    if (isResetMode) {
      handleResetSubmit(e);
    } else if (isLogin) {
      handleLoginSubmit(e);
    } else {
      handleSignupSubmit(e);
    }
  };

  const handleForgotPassword = () => {
    setIsResetMode(!isResetMode);
    resetCaptcha();
  };

  const handleSwitchToSignup = () => {
    setIsLogin(false);
    setIsResetMode(false);
    resetCaptcha();
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setIsResetMode(false);
    resetCaptcha();
  };

  const handlePasswordUpdate = async (newPassword: string): Promise<boolean> => {
    try {
      // Password update logic would go here
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContainer>
      <AuthFormRenderer
        isLogin={isLogin}
        isResetMode={isResetMode}
        isPasswordReset={isPasswordReset}
        isEmailVerified={isEmailVerified}
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
        onFormSubmit={handleFormSubmit}
        onForgotPassword={handleForgotPassword}
        onPasswordUpdate={handlePasswordUpdate}
        onSwitchToSignup={handleSwitchToSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </AuthContainer>
  );
};

export default Auth;
