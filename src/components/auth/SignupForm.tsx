
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import CaptchaWrapper from './CaptchaWrapper';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface SignupFormProps {
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
  onSubmit: (e: React.FormEvent) => void;
}

export const SignupForm = ({
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
  onSubmit
}: SignupFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; fullName?: string}>({});
  const { validation, validatePassword } = usePasswordValidation();

  const validateForm = () => {
    const newErrors: {email?: string; password?: string; fullName?: string} = {};

    if (!fullName || !fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    } else if (!/^[a-zA-ZÀ-ÿ\s\-']{2,50}$/.test(fullName.trim())) {
      newErrors.fullName = 'Formato de nombre inválido';
    }

    if (!email || !email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!password || !password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && validation.isValid) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
          className={errors.fullName ? 'border-red-500' : ''}
          autoComplete="name"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className={errors.email ? 'border-red-500' : ''}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password}</p>
        )}
        <PasswordStrengthIndicator 
          password={password} 
          errors={validation.errors} 
        />
      </div>

      <CaptchaWrapper
        onVerify={setCaptchaToken}
        captchaRef={captcha}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={loading || !captchaToken || !validation.isValid}
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>
    </form>
  );
};
