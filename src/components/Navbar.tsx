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
                  className={`hidden md:flex ${
                    scrolled 
                      ? "border-ocean text-ocean hover:bg-ocean hover:text-white" 
                      : "border-white text-white hover:bg-white hover:text-ocean"
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        scrolled 
                          ? "border-ocean text-ocean hover:bg-ocean hover:text-white" 
                          : "border-white text-white hover:bg-white hover:text-ocean"
                      }`}
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
                className={`${
                  scrolled 
                    ? "bg-green-primary hover:bg-green-600 text-white" 
                    : "bg-white text-ocean hover:bg-green-primary hover:text-white"
                }`}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${
                scrolled 
                  ? "text-ocean hover:bg-ocean/10" 
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block px-3 py-2 text-ocean hover:text-green-primary hover:bg-green-50 rounded-md font-medium w-full text-left"
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
                  className="block px-3 py-2 text-green-primary hover:bg-green-50 rounded-md font-medium w-full text-left"
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
