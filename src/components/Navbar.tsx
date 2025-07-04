import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useVisualConfig } from "@/hooks/useVisualConfig";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { config } = useVisualConfig();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  // Use navbar items from visual config or fallback to default
  const navItems = config.navbarSettings.items.filter(item => item.visible).sort((a, b) => a.order - b.order).map(item => ({
    label: item.name,
    id: item.url.replace('/', '') || item.name.toLowerCase()
  }));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${config.navbarSettings.position === 'fixed' ? 'fixed' : 'static'}`}
      style={{
        backgroundColor: scrolled 
          ? `${config.navbarSettings.backgroundColor}f2` // Add transparency
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className={`flex items-center ${
            config.logoSettings.position === 'center' ? 'justify-center flex-1' :
            config.logoSettings.position === 'right' ? 'justify-end flex-1' : 'justify-start'
          }`}>
            <h1 
              className="font-bold transition-colors"
              style={{ 
                color: scrolled ? config.navbarSettings.textColor : "white",
                fontSize: `${Math.max(config.logoSettings.height * 0.6, 16)}px`,
                height: `${config.logoSettings.height}px`,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Puerto López
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center space-x-8 ${
            config.logoSettings.position === 'center' ? 'absolute right-4' : ''
          }`}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-medium transition-colors"
                style={{ 
                  color: scrolled ? config.navbarSettings.textColor : "white"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = config.colorPalette.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = scrolled ? config.navbarSettings.textColor : "white";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className={`flex items-center space-x-4 ${
            config.logoSettings.position === 'center' ? 'absolute right-4' : ''
          }`}>
            {user ? (
              <>
                {/* Dashboard Button - Show only when authenticated */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="hidden md:flex"
                  style={{
                    borderColor: scrolled ? config.buttonStyles.secondaryColor : "white",
                    color: scrolled ? config.buttonStyles.secondaryColor : "white",
                    backgroundColor: 'transparent',
                    borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                                 config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = config.buttonStyles.secondaryColor;
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = scrolled ? config.buttonStyles.secondaryColor : "white";
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex"
                      style={{
                        borderColor: scrolled ? config.buttonStyles.secondaryColor : "white",
                        color: scrolled ? config.buttonStyles.secondaryColor : "white",
                        backgroundColor: 'transparent',
                        borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                                     config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px'
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user.user_metadata?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="md:hidden">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                style={{
                  backgroundColor: scrolled ? config.buttonStyles.primaryColor : "white",
                  color: scrolled ? "white" : config.buttonStyles.primaryColor,
                  borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                               config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  if (config.buttonStyles.hoverEffect === 'scale') {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  } else if (config.buttonStyles.hoverEffect === 'glow') {
                    e.currentTarget.style.boxShadow = `0 0 20px ${config.buttonStyles.primaryColor}40`;
                  }
                  e.currentTarget.style.backgroundColor = config.buttonStyles.secondaryColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = scrolled ? config.buttonStyles.primaryColor : "white";
                }}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{
                color: scrolled ? config.navbarSettings.textColor : "white"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = scrolled ? `${config.navbarSettings.textColor}10` : "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 rounded-lg shadow-lg mt-2"
              style={{ backgroundColor: config.navbarSettings.backgroundColor }}
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block px-3 py-2 rounded-md font-medium w-full text-left transition-colors"
                  style={{ 
                    color: config.navbarSettings.textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = config.colorPalette.primary;
                    e.currentTarget.style.backgroundColor = `${config.colorPalette.primary}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = config.navbarSettings.textColor;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md font-medium w-full text-left transition-colors"
                  style={{ 
                    color: config.buttonStyles.primaryColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${config.buttonStyles.primaryColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
