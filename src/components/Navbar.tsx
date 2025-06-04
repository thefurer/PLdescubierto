
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 smooth-transition ${
      isScrolled 
        ? 'glass-nav shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold smooth-transition">
            <span className={`${isScrolled ? 'text-ocean-dark' : 'text-white'}`}>
              Puerto López
            </span>
            <span className="ml-1 text-green-primary">Descubierto</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className={`hover:text-green-primary smooth-transition font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Inicio
            </a>
            <a 
              href="#attractions" 
              className={`hover:text-green-primary smooth-transition font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Atracciones
            </a>
            <a 
              href="#virtual-tour" 
              className={`hover:text-green-primary smooth-transition font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Metaverso
            </a>
            <a 
              href="#contact" 
              className={`hover:text-green-primary smooth-transition font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Contacto
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className={`hover:text-green-primary smooth-transition font-medium ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <UserMenu />
              </div>
            ) : (
              <Link 
                to="/auth" 
                className={`font-semibold px-6 py-2 rounded-full smooth-transition ${
                  isScrolled 
                    ? 'bg-green-primary text-white hover:bg-green-dark shadow-md hover:shadow-lg' 
                    : 'btn-ghost'
                }`}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden smooth-transition ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-card rounded-lg mt-2 p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="text-gray-700 hover:text-green-primary smooth-transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="#attractions" 
                className="text-gray-700 hover:text-green-primary smooth-transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Atracciones
              </a>
              <a 
                href="#virtual-tour" 
                className="text-gray-700 hover:text-green-primary smooth-transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Metaverso
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-green-primary smooth-transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </a>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-green-primary smooth-transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-green-primary smooth-transition font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="btn-secondary text-center"
                  onClick={() => setIsOpen(false)}
                >
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
