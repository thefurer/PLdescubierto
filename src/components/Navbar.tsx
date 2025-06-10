
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";
import AccessibilityToolbar from "./accessibility/AccessibilityToolbar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Atracciones", href: "/#attractions" },
    { name: "Guía de Viaje", href: "/travel-guide" },
    { name: "Planificar Itinerario", href: "/itinerary-planner", icon: Calendar },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-ocean to-ocean-dark rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">PL</span>
            </div>
            <span className={`font-bold text-xl transition-all duration-300 ${
              isScrolled 
                ? "text-ocean-dark" 
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-extrabold"
            } hidden sm:block`}>
              Puerto López
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                    isScrolled
                      ? "text-gray-700 hover:text-ocean hover:bg-ocean/5"
                      : "text-white hover:text-green-primary hover:bg-white/10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] font-semibold hover:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            <AccessibilityToolbar compact />
            
            {user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button className={`transition-all duration-300 ${
                    isScrolled
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-green-primary hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                  }`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <UserMenu />
              </div>
            ) : (
              <Link to="/auth">
                <Button className={`transition-all duration-300 hidden sm:flex ${
                  isScrolled
                    ? "bg-ocean hover:bg-ocean-dark text-white"
                    : "bg-white/90 hover:bg-white text-ocean-dark shadow-lg hover:shadow-xl backdrop-blur-sm"
                }`}>
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className={`lg:hidden transition-all duration-300 ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-ocean hover:bg-ocean/5 transition-colors flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {item.name}
                  </Link>
                );
              })}
              
              {user ? (
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-ocean hover:bg-ocean/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-4 w-4 inline mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-gray-700 hover:text-ocean hover:bg-ocean/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Perfil
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-ocean hover:bg-ocean/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-ocean hover:bg-ocean/5 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
