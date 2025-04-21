
import { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import CustomizationModal from "./CustomizationModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Casa", href: "#home" },
    { name: "Atracciones", href: "#attractions" },
    { name: "Actividades", href: "#activities" },
    { name: "Galería", href: "#gallery" },
    { name: "Galería Metaverso", href: "#virtual-tour" },
    { name: "Contactos", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white bg-opacity-90 backdrop-blur-sm shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="flex items-center">
          <span className="text-2xl font-bold text-ocean-dark">
          Puerto <span className="text-blue-500">López</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-ocean-dark hover:text-coral transition-colors font-medium",
                isScrolled ? "text-ocean-dark" : "text-white"
              )}
            >
              {link.name}
            </a>
          ))}
          
          {/* Customization Button */}
          <button
            onClick={() => setCustomizationModalOpen(true)}
            className={cn(
              "p-2 rounded-full transition-colors flex items-center justify-center",
              isScrolled 
                ? "bg-ocean text-white hover:bg-ocean-dark" 
                : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            )}
            aria-label="Customize"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-ocean-dark"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-ocean-dark hover:bg-ocean-light hover:text-ocean-dark rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCustomizationModalOpen(true);
              }}
              className="px-4 py-2 text-ocean-dark hover:bg-ocean-light hover:text-ocean-dark rounded-md transition-colors flex items-center"
            >
              <Settings size={18} className="mr-2" />
              <span>Personalizar</span>
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      <CustomizationModal 
        isOpen={customizationModalOpen} 
        onClose={() => setCustomizationModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
