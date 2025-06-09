
import { useState } from 'react';
import { validateEmail, validateFullName, sanitizeInput } from '@/utils/inputValidation';
import { usePasswordValidation } from './usePasswordValidation';

interface SecureFormData {
  email: string;
  password: string;
  fullName?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  general?: string;
}

export const useSecureForm = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const { validatePassword } = usePasswordValidation();

  const validateForm = (data: SecureFormData): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!data.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    // Password validation
    if (!data.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    // Full name validation (for signup)
    if (data.fullName !== undefined) {
      if (!data.fullName) {
        newErrors.fullName = 'El nombre completo es requerido';
      } else if (!validateFullName(data.fullName)) {
        newErrors.fullName = 'Formato de nombre inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeFormData = (data: SecureFormData): SecureFormData => {
    return {
      email: sanitizeInput(data.email).toLowerCase(),
      password: data.password, // Don't sanitize passwords
      fullName: data.fullName ? sanitizeInput(data.fullName) : undefined
    };
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateForm,
    sanitizeFormData,
    clearErrors
  };
};
