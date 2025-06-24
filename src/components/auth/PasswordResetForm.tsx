
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import CaptchaWrapper from './CaptchaWrapper';
import { AuthCard } from './AuthCard';
import { AuthHeader } from './AuthHeader';

interface PasswordResetFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  captcha: React.RefObject<any>;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const PasswordResetForm = ({
  email,
  setEmail,
  loading,
  captchaToken,
  setCaptchaToken,
  captcha,
  onSubmit,
  onBackToLogin
}: PasswordResetFormProps) => {
  return (
    <AuthCard>
      <AuthHeader
        title="Restablecer Contraseña"
        subtitle="Ingresa tu email para recibir las instrucciones"
      />
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
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
        </div>

        <CaptchaWrapper
          onVerify={setCaptchaToken}
          captchaRef={captcha}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !captchaToken}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          Enviar Instrucciones
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBackToLogin}
          disabled={loading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio de sesión
        </Button>
      </form>
    </AuthCard>
  );
};
