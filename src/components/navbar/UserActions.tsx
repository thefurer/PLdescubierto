
import { Button } from "@/components/ui/button";
import { Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavbarButtonStyles } from "./NavbarButtonStyles";

interface UserActionsProps {
  user: any;
  scrolled: boolean;
  onNavigate: (url: string) => void;
  onSignOut: () => void;
}

const UserActions = ({ user, scrolled, onNavigate, onSignOut }: UserActionsProps) => {
  const { getButtonStyle, applyHoverEffect } = useNavbarButtonStyles();

  const getNavPositionClass = () => {
    return '';
  };

  return (
    <div className={`flex items-center space-x-4 ${getNavPositionClass()}`}>
      {user ? (
        <>
          {/* Dashboard Button - Show only when authenticated */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/dashboard')}
            className="hidden md:flex border-0"
            style={getButtonStyle(false, scrolled)}
            onMouseEnter={(e) => {
              e.currentTarget.dataset.scrolled = scrolled.toString();
              applyHoverEffect(e.currentTarget, true, false);
            }}
            onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false, false)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Dashboard
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex border-0"
                style={getButtonStyle(false, scrolled)}
              >
                <User className="h-4 w-4 mr-2" />
                {user.user_metadata?.full_name || user.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onNavigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('/dashboard')} className="md:hidden">
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <button
          onClick={() => onNavigate('/auth')}
          style={getButtonStyle(true, scrolled)}
          onMouseEnter={(e) => {
            e.currentTarget.dataset.scrolled = scrolled.toString();
            applyHoverEffect(e.currentTarget, true, true);
          }}
          onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false, true)}
          className="px-4 py-2 font-medium"
        >
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default UserActions;
