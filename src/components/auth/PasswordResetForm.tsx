
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import CaptchaWrapper from './CaptchaWrapper';
import { useSecureForm } from '@/hooks/useSecureForm';

interface PasswordResetFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  captcha: React.RefObject<any>;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const PasswordResetForm = ({
  email,
  setEmail,
  loading,
  captchaToken,
  setCaptchaToken,
  captcha,
  onSubmit,
  onBackToLogin
}: PasswordResetFormProps) => {
  const { errors, validateForm, sanitizeFormData, clearErrors } = useSecureForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    const formData = { email, password: 'dummy' }; // Password not needed for reset
    const sanitizedData = sanitizeFormData(formData);
    
    // Only validate email for password reset
    if (sanitizedData.email && errors.email === undefined) {
      setEmail(sanitizedData.email);
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu email"
          required
          disabled={loading}
          className={errors.email ? 'border-red-500' : ''}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
        <p className="text-sm text-gray-600">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <CaptchaWrapper
        onVerify={setCaptchaToken}
        captchaRef={captcha}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !captchaToken}
      >
        {loading ? 'Enviando...' : 'Enviar Enlace'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
          disabled={loading}
        >
          <ArrowLeft size={16} className="mr-1" />
          Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
};
