
import React from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaWrapperProps {
  onVerify: (token: string) => void;
  captchaRef: React.RefObject<any>;
}

const CaptchaWrapper = ({ onVerify, captchaRef }: CaptchaWrapperProps) => {
  // Use environment variable for HCaptcha site key with fallback
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

  return (
    <HCaptcha
      ref={captchaRef}
      sitekey={siteKey}
      onVerify={onVerify}
      className="w-full flex justify-center"
    />
  );
};

export default CaptchaWrapper;
