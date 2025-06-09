
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  errors: string[];
}

const PasswordStrengthIndicator = ({ password, errors }: PasswordStrengthIndicatorProps) => {
  const requirements = [
    { label: 'Al menos 8 caracteres', test: password.length >= 8 },
    { label: 'Una letra mayúscula', test: /[A-Z]/.test(password) },
    { label: 'Una letra minúscula', test: /[a-z]/.test(password) },
    { label: 'Un número', test: /[0-9]/.test(password) },
    { label: 'Un carácter especial', test: /[^a-zA-Z0-9]/.test(password) }
  ];

  if (!password) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md">
      <p className="text-sm font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center text-sm">
            {req.test ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={req.test ? 'text-green-700' : 'text-red-700'}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthIndicator;
