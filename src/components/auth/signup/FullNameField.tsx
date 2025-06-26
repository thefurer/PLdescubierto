
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';

interface FullNameFieldProps {
  fullName: string;
  setFullName: (name: string) => void;
  loading: boolean;
}

export const FullNameField = ({ fullName, setFullName, loading }: FullNameFieldProps) => {
  return (
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
  );
};
