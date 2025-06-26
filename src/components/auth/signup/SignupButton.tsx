
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';

interface SignupButtonProps {
  canSubmit: boolean;
  loading: boolean;
}

export const SignupButton = ({ canSubmit, loading }: SignupButtonProps) => {
  return (
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
  );
};
