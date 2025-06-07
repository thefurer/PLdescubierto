
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import UserMenu from "./UserMenu";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const t = useTranslations();

  // Check if we're on a resource page
  const isResourcePage = ['/travel-guide', '/faq', '/testimonials', '/blog'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Different styling for resource pages
  const getNavbarClass = () => {
    if (isResourcePage) {
      return 'fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm';
    }
    return `fixed w-full z-50 smooth-transition ${isScrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`;
  };

  const getTextClass = (baseClass = '') => {
    if (isResourcePage) {
      return `${baseClass} text-gray-700 hover:text-green-primary smooth-transition font-medium`;
    }
    return `${baseClass} hover:text-green-primary smooth-transition font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`;
  };

  const getLogoClass = () => {
    if (isResourcePage) {
      return 'text-ocean-dark';
    }
    return isScrolled ? 'text-ocean-dark' : 'text-white';
  };

  const getButtonClass = () => {
    if (isResourcePage) {
      return 'font-semibold px-6 py-2 rounded-full bg-green-primary text-white hover:bg-green-dark shadow-md hover:shadow-lg smooth-transition';
    }
    return `font-semibold px-6 py-2 rounded-full smooth-transition ${isScrolled ? 'bg-green-primary text-white hover:bg-green-dark shadow-md hover:shadow-lg' : 'btn-ghost'}`;
  };

  const getMobileButtonClass = () => {
    if (isResourcePage) {
      return 'text-gray-700';
    }
    return isScrolled ? 'text-gray-700' : 'text-white';
  };

  return (
    <nav className={getNavbarClass()}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold smooth-transition">
            <span className={getLogoClass()}>
              Puerto López
            </span>
            <span className="ml-1 text-green-primary text-slate-50"></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className={getTextClass()}>
              {t.home}
            </a>
            <a href="#attractions" className={getTextClass()}>
              {t.attractions}
            </a>
            <a href="#virtual-tour" className={getTextClass()}>
              {t.virtualTour}
            </a>
            <Link to="/blog" className={getTextClass()}>
              {t.blog}
            </Link>
            <a href="#contact" className={getTextClass()}>
              {t.contact}
            </a>
            
            <LanguageSelector />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className={getTextClass()}>
                  {t.dashboard}
                </Link>
                <UserMenu />
              </div>
            ) : (
              <Link to="/auth" className={getButtonClass()}>
                {t.login}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className={`md:hidden smooth-transition ${getMobileButtonClass()}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden glass-card rounded-lg mt-2 p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                {t.home}
              </a>
              <a href="#attractions" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                {t.attractions}
              </a>
              <a href="#virtual-tour" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                {t.virtualTour}
              </a>
              <Link to="/blog" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                {t.blog}
              </Link>
              <a href="#contact" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                {t.contact}
              </a>
              
              <LanguageSelector />
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                    {t.dashboard}
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-green-primary smooth-transition font-medium" onClick={() => setIsOpen(false)}>
                    {t.profile}
                  </Link>
                </>
              ) : (
                <Link to="/auth" className="btn-secondary text-center" onClick={() => setIsOpen(false)}>
                  {t.login}
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
