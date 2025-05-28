
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className={`${isScrolled ? 'text-ocean-dark' : 'text-white'}`}>
              Puerto López
            </span>
            <span className="text-green-500 ml-1">Descubierto</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className={`hover:text-green-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Inicio
            </a>
            <a 
              href="#attractions" 
              className={`hover:text-green-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Atracciones
            </a>
            <a 
              href="#activities" 
              className={`hover:text-green-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Actividades
            </a>
            <a 
              href="#gallery" 
              className={`hover:text-green-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Galería
            </a>
            <a 
              href="#contact" 
              className={`hover:text-green-500 transition-colors ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              Contacto
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard"
                  className={`hover:text-green-500 transition-colors ${
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
                className={`px-4 py-2 rounded-full border-2 border-green-500 hover:bg-green-500 hover:text-white transition-colors ${
                  isScrolled ? 'text-green-500 bg-transparent' : 'text-white bg-transparent'
                }`}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-green-500 transition-colors">
                Inicio
              </a>
              <a href="#attractions" className="text-gray-700 hover:text-green-500 transition-colors">
                Atracciones
              </a>
              <a href="#activities" className="text-gray-700 hover:text-green-500 transition-colors">
                Actividades
              </a>
              <a href="#gallery" className="text-gray-700 hover:text-green-500 transition-colors">
                Galería
              </a>
              <a href="#contact" className="text-gray-700 hover:text-green-500 transition-colors">
                Contacto
              </a>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-500 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-green-500 transition-colors">
                    Mi Perfil
                  </Link>
                </>
              ) : (
                <Link 
                  to="/auth"
                  className="px-4 py-2 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors text-center"
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
