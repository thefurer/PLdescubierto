
import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-8 shadow-2xl animate-scale-in">
      {children}
    </div>
  );
};
