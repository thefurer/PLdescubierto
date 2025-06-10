
import { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export const useCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captcha = useRef<HCaptcha>(null);

  const resetCaptcha = () => {
    if (captcha.current) {
      captcha.current.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  return {
    captchaToken,
    setCaptchaToken,
    captcha,
    resetCaptcha
  };
};
