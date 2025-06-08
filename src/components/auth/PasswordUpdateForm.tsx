
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PasswordUpdateFormProps {
  loading: boolean;
  onSubmit: (password: string) => Promise<boolean>;
}

export const PasswordUpdateForm = ({ loading, onSubmit }: PasswordUpdateFormProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const passwordRequirements = [
    { text: 'Al menos 6 caracteres', met: password.length >= 6 },
    { text: 'Incluye al menos una letra', met: /[a-zA-Z]/.test(password) },
    { text: 'Incluye al menos un número', met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setPasswordError('');
    const success = await onSubmit(password);
    
    if (success) {
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-ocean" />
          </div>
        </div>
        <CardTitle className="text-xl text-ocean-dark">
          Actualizar Contraseña
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Ingresa tu nueva contraseña para completar el proceso
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="password">Nueva Contraseña</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
                placeholder="Tu nueva contraseña"
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {password && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Requisitos de contraseña:</h4>
              <ul className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <li key={index} className="flex items-center text-xs">
                    <CheckCircle 
                      className={`h-3 w-3 mr-2 ${
                        req.met ? 'text-green-500' : 'text-gray-300'
                      }`} 
                    />
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pr-10"
                placeholder="Confirma tu nueva contraseña"
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{passwordError}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-ocean hover:bg-ocean-dark"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
