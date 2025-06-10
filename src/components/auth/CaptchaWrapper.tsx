
import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
  captchaRef: React.RefObject<any>;
}

const CaptchaWrapper = ({ onVerify, captchaRef }: CaptchaWrapperProps) => {
  // Use the correct HCaptcha site key
  const siteKey = 'f9c44570-e81a-45ec-8d28-ea56a65eafc6';

  const handleError = (error: string) => {
    console.error('HCaptcha error:', error);
    // Reset captcha on error
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleExpire = () => {
    console.log('HCaptcha expired');
    // Reset captcha on expiration
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleVerify = (token: string) => {
    console.log('HCaptcha verified:', token);
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
