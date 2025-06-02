
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuthState } from '@/hooks/useAuthState';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthFormRenderer } from '@/components/auth/AuthFormRenderer';
import { AuthNavigation } from '@/components/auth/AuthNavigation';

const Auth = () => {
  const {
    isLogin,
    setIsLogin,
    isResetMode,
    setIsResetMode,
    isPasswordReset,
    isEmailVerified,
    getTitle,
    getSubtitle,
    handleBackToLogin
  } = useAuthState();
  
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

  const handleForgotPassword = () => setIsResetMode(true);
  const handleToggleMode = () => setIsLogin(!isLogin);

  return (
    <AuthContainer>
      <AuthHeader title={getTitle()} subtitle={getSubtitle()} />

      <AuthCard>
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
        />

        <AuthNavigation
          isLogin={isLogin}
          isResetMode={isResetMode}
          isPasswordReset={isPasswordReset}
          isEmailVerified={isEmailVerified}
          onToggleMode={handleToggleMode}
          onBackToLogin={handleBackToLogin}
        />
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth;
