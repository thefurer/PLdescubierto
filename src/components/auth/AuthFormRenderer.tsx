import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { PasswordResetForm } from './PasswordResetForm';
import { PasswordUpdateForm } from './PasswordUpdateForm';
import { EmailConfirmationStatus } from './EmailConfirmationStatus';

interface AuthFormRendererProps {
  isLogin: boolean;
  isResetMode: boolean;
  isPasswordReset: boolean;
  isEmailVerified: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  loading: boolean;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  captcha: React.RefObject<any>;
  onFormSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onPasswordUpdate: (password: string) => Promise<boolean>;
  onSwitchToSignup: () => void;
  onSwitchToLogin: () => void;
}

export const AuthFormRenderer = ({
  isLogin,
  isResetMode,
  isPasswordReset,
  isEmailVerified,
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
  onFormSubmit,
  onForgotPassword,
  onPasswordUpdate,
  onSwitchToSignup,
  onSwitchToLogin
}: AuthFormRendererProps) => {
  const { toast } = useToast();

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

  const handleContinueAfterVerification = () => {
    window.location.href = '/';
  };

  if (isEmailVerified) {
    return (
      <EmailConfirmationStatus
        isVerified={true}
        onContinue={handleContinueAfterVerification}
      />
    );
  }

  if (isPasswordReset) {
    return (
      <PasswordUpdateForm
        loading={loading}
        onSubmit={onPasswordUpdate}
      />
    );
  }

  if (isResetMode) {
    return (
      <PasswordResetForm
        email={email}
        setEmail={setEmail}
        loading={loading}
        captchaToken={captchaToken}
        setCaptchaToken={setCaptchaToken}
        captcha={captcha}
        onSubmit={onFormSubmit}
        onBackToLogin={onForgotPassword}
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
        onSubmit={onFormSubmit}
        onForgotPassword={onForgotPassword}
        onSwitchToSignup={onSwitchToSignup}
      />
    );
  }

  // For signup, we still keep the captcha requirement
  return (
    <div className="space-y-4">
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
        onSubmit={onFormSubmit}
      />
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
          disabled={loading}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
};
