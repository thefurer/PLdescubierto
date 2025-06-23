
import { useMemo } from 'react';

interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const usePasswordValidation = (password: string): PasswordValidation => {
  return useMemo(() => {
    const errors: string[] = [];
    let score = 0;

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    } else {
      score++;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    } else {
      score++;
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    } else {
      score++;
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    } else {
      score++;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    } else {
      score++;
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      strength
    };
  }, [password]);
};
