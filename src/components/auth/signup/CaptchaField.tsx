
import { Label } from '@/components/ui/label';
import CaptchaWrapper from '../CaptchaWrapper';

interface CaptchaFieldProps {
  onVerify: (token: string) => void;
  captchaRef: React.RefObject<any>;
}

export const CaptchaField = ({ onVerify, captchaRef }: CaptchaFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>Verificación de Seguridad *</Label>
      <CaptchaWrapper
        onVerify={onVerify}
        captchaRef={captchaRef}
      />
    </div>
  );
};
