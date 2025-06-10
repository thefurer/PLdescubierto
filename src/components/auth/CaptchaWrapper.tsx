
import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
  captchaRef: React.RefObject<any>;
}

const CaptchaWrapper = ({ onVerify, captchaRef }: CaptchaWrapperProps) => {
  // Usar la clave correcta de HCaptcha que proporcionaste
  const siteKey = 'f9c44570-e81a-45ec-8d28-ea56a65eafc6';

  const handleError = (error: string) => {
    console.error('HCaptcha error:', error);
    // Resetear captcha en caso de error
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
    // Notificar que el token es nulo en caso de error
    onVerify('');
  };

  const handleExpire = () => {
    console.log('HCaptcha expiró');
    // Resetear captcha cuando expire
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
    // Limpiar el token cuando expire
    onVerify('');
  };

  const handleVerify = (token: string) => {
    console.log('HCaptcha verificado exitosamente');
    onVerify(token);
  };

  return (
    <div className="w-full flex justify-center mb-4">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        size="normal"
        theme="light"
      />
    </div>
  );
};

export default CaptchaWrapper;
