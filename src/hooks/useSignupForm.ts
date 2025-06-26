
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

export const useSignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailAuthorized, setIsEmailAuthorized] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);
  const { signUp } = useAuth();
  const { isValid: isPasswordValid, errors: passwordErrors } = usePasswordValidation(password);

  const resetCaptcha = () => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  const handleEmailAuthorizationChange = (authorized: boolean) => {
    console.log('Email authorization status changed:', { 
      email: email.toLowerCase().trim(), 
      authorized 
    });
    setIsEmailAuthorized(authorized);
  };

  const handleCaptchaVerify = (token: string) => {
    console.log('Captcha verified:', !!token);
    setCaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanEmail = email.toLowerCase().trim();
    const cleanFullName = fullName.trim();
    
    console.log('=== SIGNUP FORM SUBMISSION ===');
    console.log('Form validation:', { 
      email: cleanEmail, 
      isEmailAuthorized, 
      isPasswordValid,
      fullName: cleanFullName,
      hasFullName: cleanFullName.length >= 2,
      captchaToken: !!captchaToken
    });
    
    // Validaciones exhaustivas
    if (!isEmailAuthorized) {
      console.log('Signup blocked: email not authorized');
      return;
    }

    if (!isPasswordValid) {
      console.log('Signup blocked: password not valid:', passwordErrors);
      return;
    }

    if (!cleanFullName || cleanFullName.length < 2) {
      console.log('Signup blocked: full name required (min 2 chars)');
      return;
    }

    if (!captchaToken) {
      console.log('Signup blocked: captcha token required');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting signup with:', { 
        cleanEmail, 
        cleanFullName,
        passwordLength: password.length,
        hasCaptcha: !!captchaToken
      });
      
      // Pass the CAPTCHA token to the signUp function
      const result = await signUp(cleanEmail, password, cleanFullName, captchaToken);
      
      if (result.error) {
        console.error('Signup failed:', result.error);
        resetCaptcha();
      } else {
        console.log('Signup completed successfully:', result.user?.id);
        resetCaptcha();
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      resetCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && 
                   isPasswordValid && 
                   isEmailAuthorized && 
                   fullName.trim().length >= 2 &&
                   !!captchaToken;

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    isEmailAuthorized,
    captchaToken,
    setCaptchaToken,
    captchaRef,
    isPasswordValid,
    passwordErrors,
    canSubmit,
    handleSubmit,
    handleEmailAuthorizationChange,
    handleCaptchaVerify,
    resetCaptcha
  };
};
