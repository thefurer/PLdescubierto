
import { useState } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 hover:bg-white/10 transition-colors duration-200"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-white/20 text-white text-sm">
              {getInitials(user.email || '')}
            </AvatarFallback>
          </Avatar>
          <span className="text-white text-sm hidden sm:block">{displayName}</span>
          <ChevronDown className="h-4 w-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 mt-2 glass-card border-white/20"
      >
        <div className="px-3 py-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        
        <DropdownMenuItem 
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-2" />
          Editar Página
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/profile')}
          className="cursor-pointer"
        >
          <User className="h-4 w-4 mr-2" />
          Mi Perfil
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
