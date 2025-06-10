
export interface AuthFormData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthHookReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  fullName: string;
  setFullName: (fullName: string) => void;
  loading: boolean;
  captchaToken: string | null;
  setCaptchaToken: (token: string | null) => void;
  captcha: React.RefObject<any>;
  handlePasswordReset: (e: React.FormEvent) => Promise<void>;
  handleLogin: (e: React.FormEvent) => Promise<void>;
  handleSignup: (e: React.FormEvent) => Promise<void>;
  handlePasswordUpdate: (newPassword: string) => Promise<boolean>;
}
