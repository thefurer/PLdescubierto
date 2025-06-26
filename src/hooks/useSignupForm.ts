import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuthContext';

export const useSignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const captchaRef = useRef<any>(null);

  const { signUp } = useAuth();

  const handleEmailAuthorizationChange = (authorized: boolean) => {
    setCanSubmit(authorized && fullName.trim().length >= 2 && password.length >= 6 && !!captchaToken);
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setCanSubmit(token !== null && email.includes('@') && fullName.trim().length >= 2 && password.length >= 6);
  };

  const resetCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
    setCaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      console.warn('Form submission blocked: not all requirements met');
      return;
    }

    if (!captchaToken) {
      console.warn('Form submission blocked: CAPTCHA token is missing');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName, captchaToken);
      resetCaptcha();
    } finally {
      setLoading(false);
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
    captchaRef,
    captchaToken,
    setCaptchaToken,
    canSubmit,
    handleSubmit,
    handleEmailAuthorizationChange,
    handleCaptchaVerify,
    resetCaptcha
  };
};
