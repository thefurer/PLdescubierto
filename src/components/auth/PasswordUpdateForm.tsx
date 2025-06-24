
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { AuthCard } from './AuthCard';
import { AuthHeader } from './AuthHeader';

interface PasswordUpdateFormProps {
  loading: boolean;
  onSubmit: (password: string) => Promise<boolean>;
}

export const PasswordUpdateForm = ({ loading, onSubmit }: PasswordUpdateFormProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const { isValid } = usePasswordValidation(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || password !== confirmPassword) {
      return;
    }

    const result = await onSubmit(password);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  if (success) {
    return (
      <AuthCard>
        <div className="text-center space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <AuthHeader
            title="¡Contraseña Actualizada!"
            subtitle="Tu contraseña ha sido actualizada exitosamente"
          />
          <p className="text-sm text-gray-600">
            Serás redirigido automáticamente...
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Actualizar Contraseña"
        subtitle="Ingresa tu nueva contraseña"
      />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">Nueva Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu nueva contraseña"
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
          {password && <PasswordStrengthIndicator password={password} />}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-600 mt-1">
              Las contraseñas no coinciden
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !isValid || password !== confirmPassword}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lock className="mr-2 h-4 w-4" />
          )}
          Actualizar Contraseña
        </Button>
      </form>
    </AuthCard>
  );
};
