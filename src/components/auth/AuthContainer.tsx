
import { ReactNode } from 'react';

interface AuthContainerProps {
  children: ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Background with Gradient */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Ocean Wave Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="white" opacity="0.1"/>
          <path d="M0,60 Q25,40 50,60 T100,60 L100,100 L0,100 Z" fill="white" opacity="0.05"/>
        </svg>
      </div>

      <div className="max-w-md w-full space-y-8 px-4 relative z-10">
        {children}
      </div>

      {/* Background Elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-ocean/10 rounded-full blur-3xl"></div>
    </div>
  );
};
