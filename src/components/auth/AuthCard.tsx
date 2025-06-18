
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 animate-scale-in">
      {children}
    </div>
  );
};
