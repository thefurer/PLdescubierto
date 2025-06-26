
import { AuthCard } from './AuthCard';
import { AuthHeader } from './AuthHeader';
import { useSignupForm } from '@/hooks/useSignupForm';
import { FullNameField } from './signup/FullNameField';
import { EmailField } from './signup/EmailField';
import { PasswordField } from './signup/PasswordField';
import { CaptchaField } from './signup/CaptchaField';
import { SignupButton } from './signup/SignupButton';
import { LoginToggle } from './signup/LoginToggle';

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    captchaRef,
    canSubmit,
    handleSubmit,
    handleEmailAuthorizationChange,
    handleCaptchaVerify
  } = useSignupForm();

  console.log('SignupForm render state:', {
    email: email.toLowerCase().trim(),
    hasValidFullName: fullName.trim().length >= 2,
    canSubmit,
    loading
  });

  return (
    <AuthCard>
      <AuthHeader
        title="Crear Cuenta"
        subtitle="Únete a Puerto López"
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FullNameField
          fullName={fullName}
          setFullName={setFullName}
          loading={loading}
        />

        <EmailField
          email={email}
          setEmail={setEmail}
          loading={loading}
          onAuthorizationChecked={handleEmailAuthorizationChange}
        />

        <PasswordField
          password={password}
          setPassword={setPassword}
          loading={loading}
        />

        <CaptchaField
          onVerify={handleCaptchaVerify}
          captchaRef={captchaRef}
        />

        <SignupButton
          canSubmit={canSubmit}
          loading={loading}
        />

        <LoginToggle
          onToggleMode={onToggleMode}
          loading={loading}
        />
      </form>
    </AuthCard>
  );
};
