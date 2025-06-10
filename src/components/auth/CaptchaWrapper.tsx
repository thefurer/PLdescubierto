
import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
  captchaRef: React.RefObject<any>;
}

const CaptchaWrapper = ({ onVerify, captchaRef }: CaptchaWrapperProps) => {
  // Use environment variable for HCaptcha site key - this should match your HCaptcha dashboard
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

  // If no site key is configured, show a message
  if (!siteKey) {
    return (
      <div className="w-full flex justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          Configuración de HCaptcha requerida. Por favor configura VITE_HCAPTCHA_SITE_KEY.
        </p>
      </div>
    );
  }

  const handleError = (error: string) => {
    console.error('HCaptcha error:', error);
  };

  const handleExpire = () => {
    console.log('HCaptcha expired');
  };

  return (
    <div className="w-full flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={onVerify}
        onError={handleError}
        onExpire={handleExpire}
        size="normal"
        theme="light"
      />
    </div>
  );
};

export default CaptchaWrapper;
