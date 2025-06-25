
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import EmailAuthorizationCheck from './EmailAuthorizationCheck';
import { AuthCard } from './AuthCard';
import { AuthHeader } from './AuthHeader';

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm = ({ onToggleMode }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailAuthorized, setIsEmailAuthorized] = useState(false);
  const { signUp } = useAuth();
  const { isValid: isPasswordValid, errors: passwordErrors } = usePasswordValidation(password);

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
      hasFullName: cleanFullName.length > 0
    });
    
    // Validaciones
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

    setLoading(true);
    try {
      console.log('Attempting signup with:', { 
        cleanEmail, 
        cleanFullName,
        passwordLength: password.length
      });
      
      const result = await signUp(cleanEmail, password, cleanFullName);
      
      if (result.error) {
        console.error('Signup failed:', result.error);
      } else {
        console.log('Signup completed successfully:', result.user?.id);
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthorizationChange = (authorized: boolean) => {
    console.log('Email authorization changed:', { 
      email: email.toLowerCase().trim(), 
      authorized 
    });
    setIsEmailAuthorized(authorized);
  };

  const canSubmit = !loading && 
                   isPasswordValid && 
                   isEmailAuthorized && 
                   fullName.trim().length >= 2;

  console.log('SignupForm render state:', {
    email: email.toLowerCase().trim(),
    isEmailAuthorized,
    isPasswordValid,
    hasValidFullName: fullName.trim().length >= 2,
    canSubmit,
    loading
  });

  return (
    <AuthCard>
      <AuthHeader
        title="Crear Cuenta"
        subtitle="Únete a Puerto López"
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nombre Completo *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre completo"
              className="pl-10"
              required
              disabled={loading}
              minLength={2}
            />
          </div>
          {fullName.trim().length > 0 && fullName.trim().length < 2 && (
            <p className="text-sm text-red-600 mt-1">
              El nombre debe tener al menos 2 caracteres
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <EmailAuthorizationCheck 
            email={email} 
            onAuthorizationChecked={handleEmailAuthorizationChange}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </EmailAuthorizationCheck>
        </div>

        <div>
          <Label htmlFor="password">Contraseña *</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
          {password && <PasswordStrengthIndicator password={password} />}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Crear Cuenta
            </>
          )}
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={onToggleMode}
            className="text-ocean hover:underline font-medium"
            disabled={loading}
          >
            Inicia sesión aquí
          </button>
        </p>
      </form>
    </AuthCard>
  );
};
