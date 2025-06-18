
import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthContainerProps {
  children: ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Simplified background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor"/>
        </svg>
      </div>

      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Volver al inicio</span>
      </Link>

      <div className="max-w-md w-full space-y-8 px-4 relative z-10">
        {children}
      </div>

      {/* Subtle background elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
    </div>
  );
};
