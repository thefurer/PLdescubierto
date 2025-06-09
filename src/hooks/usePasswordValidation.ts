
import { useState } from 'react';

interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export const usePasswordValidation = () => {
  const [validation, setValidation] = useState<PasswordValidation>({
    isValid: true,
    errors: []
  });

  const validatePassword = (password: string): PasswordValidation => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }

    const result = {
      isValid: errors.length === 0,
      errors
    };

    setValidation(result);
    return result;
  };

  return {
    validation,
    validatePassword
  };
};
