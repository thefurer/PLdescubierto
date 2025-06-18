
import { useState, useRef } from 'react';
import { useLogin } from './useLogin';
import { useSignup } from './useSignup';
import { usePasswordReset } from './usePasswordReset';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<any>(null);

  const { handleLogin } = useLogin();
  const { handleSignup } = useSignup();
  const { handlePasswordReset } = usePasswordReset();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password, captchaToken, setLoading);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignup(email, password, fullName, captchaToken, setLoading);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePasswordReset(email, captchaToken, setLoading);
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    if (captcha.current) {
      captcha.current.resetCaptcha();
    }
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
    handleLoginSubmit,
    handleSignupSubmit,
    handleResetSubmit,
    resetCaptcha
  };
};
