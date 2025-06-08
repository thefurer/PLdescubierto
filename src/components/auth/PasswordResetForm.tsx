
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface PasswordResetFormProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  captcha: React.RefObject<HCaptcha>;
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
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
          placeholder="tu@email.com"
        />
      </div>

      <div className="flex justify-center">
        <HCaptcha
          ref={captcha}
          sitekey="f9c44570-e81a-45ec-8d28-ea56a65eafc6"
          onVerify={(token) => {
            setCaptchaToken(token);
          }}
          onExpire={() => {
            setCaptchaToken(null);
          }}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-ocean hover:bg-ocean-dark"
        disabled={loading || !captchaToken}
      >
        {loading ? 'Procesando...' : 'Enviar enlace de restablecimiento'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-ocean hover:text-ocean-dark transition-colors text-sm"
        >
          ← Volver al inicio de sesión
        </button>
      </div>
    </form>
  );
};
