
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import EmailAuthorizationCheck from '../EmailAuthorizationCheck';

interface EmailFieldProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  onAuthorizationChecked: (authorized: boolean) => void;
}

export const EmailField = ({ email, setEmail, loading, onAuthorizationChecked }: EmailFieldProps) => {
  return (
    <div>
      <Label htmlFor="email">Email *</Label>
      <EmailAuthorizationCheck 
        email={email} 
        onAuthorizationChecked={onAuthorizationChecked}
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
  );
};
