
import { useAuthFormState } from './useAuthFormState';
import { useCaptcha } from './useCaptcha';
import { usePasswordReset } from './usePasswordReset';
import { useLogin } from './useLogin';
import { useSignup } from './useSignup';
import type { AuthHookReturn } from '@/types/auth';

export const useAuthForm = (): AuthHookReturn => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    setLoading
  } = useAuthFormState();

  const {
    captchaToken,
    setCaptchaToken,
    captcha,
    resetCaptcha
  } = useCaptcha();

  const { handlePasswordReset: resetPassword, handlePasswordUpdate } = usePasswordReset();
  const { handleLogin: loginUser } = useLogin();
  const { handleSignup: signupUser } = useSignup();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email, captchaToken, resetCaptcha, setLoading);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(email, password, captchaToken, resetCaptcha, setLoading);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signupUser(email, password, fullName, captchaToken, resetCaptcha, setLoading);
  };

  const handlePasswordUpdateWrapper = async (newPassword: string) => {
    return await handlePasswordUpdate(newPassword, setLoading);
  };

  return {
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
    handlePasswordUpdate: handlePasswordUpdateWrapper
  };
};
