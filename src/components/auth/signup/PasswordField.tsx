
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';

interface PasswordFieldProps {
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
}

export const PasswordField = ({ password, setPassword, loading }: PasswordFieldProps) => {
  return (
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
  );
};
