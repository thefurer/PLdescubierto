
import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
  captchaRef: React.RefObject<any>;
}

const CaptchaWrapper = ({ onVerify, captchaRef }: CaptchaWrapperProps) => {
  // Use the HCaptcha site key - this should be the public site key, not the secret
  const siteKey = 'f9c44570-e81a-45ec-8d28-ea56a65eafc6';

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
