
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
  const { isValid } = usePasswordValidation(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== SIGNUP FORM SUBMISSION ===');
    console.log('Form data:', { 
      email: email.toLowerCase().trim(), 
      isEmailAuthorized, 
      isPasswordValid: isValid,
      fullName: fullName.trim()
    });
    
    if (!isEmailAuthorized) {
      console.log('Signup blocked: email not authorized');
      return;
    }

    if (!isValid) {
      console.log('Signup blocked: password not valid');
      return;
    }

    if (!fullName.trim()) {
      console.log('Signup blocked: full name required');
      return;
    }

    setLoading(true);
    try {
      // Usar email en minúsculas y sin espacios
      const cleanEmail = email.toLowerCase().trim();
      const cleanFullName = fullName.trim();
      
      console.log('Attempting signup with cleaned data:', { 
        cleanEmail, 
        cleanFullName 
      });
      
      await signUp(cleanEmail, password, cleanFullName);
      console.log('Signup completed successfully');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthorizationChange = (authorized: boolean) => {
    console.log('Email authorization state changed:', { 
      email: email.toLowerCase().trim(), 
      authorized 
    });
    setIsEmailAuthorized(authorized);
  };

  const canSubmit = !loading && isValid && isEmailAuthorized && fullName.trim().length > 0;

  console.log('SignupForm render state:', {
    email,
    isEmailAuthorized,
    isPasswordValid: isValid,
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
          <Label htmlFor="fullName">Nombre Completo</Label>
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
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
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
          <Label htmlFor="password">Contraseña</Label>
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Crear Cuenta
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
