
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useVisualConfig } from "@/hooks/useVisualConfig";

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { config } = useVisualConfig();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to visual config updates
  useEffect(() => {
    const handleConfigUpdate = () => {
      // Force component re-render when config updates
      setIsOpen(prev => prev);
    };
    
    window.addEventListener('visual-config-updated', handleConfigUpdate);
    return () => window.removeEventListener('visual-config-updated', handleConfigUpdate);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    // Always navigate to home page first, then scroll to section
    if (location.pathname !== '/') {
      // Navigate to home page with hash
      navigate(`/${sectionId}`);
    } else {
      // We're already on the home page, scroll to section
      if (sectionId.startsWith('#')) {
        const elementId = sectionId.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    setIsOpen(false);
  };

  const handleNavigation = (url: string) => {
    if (url === '#contacto') {
      // Open chatbot instead of scrolling
      const chatButton = document.querySelector('[aria-label="Abrir chat de soporte"]') as HTMLButtonElement;
      if (chatButton) {
        chatButton.click();
      }
    } else if (url === '#inicio') {
      // Navigate to home page
      navigate('/');
    } else if (url === '#atracciones' || url === '#galeria') {
      // Navigate to home page and scroll to section
      scrollToSection(url);
    } else if (url.startsWith('#')) {
      scrollToSection(url);
    } else if (url.startsWith('/')) {
      navigate(url);
    } else {
      // External links
      window.location.href = url;
    }
    setIsOpen(false);
  };

  // Determine if current page is home page
  const isHomePage = location.pathname === '/';

  // Use navbar items from visual config, but filter based on page type
  const allNavItems = config.navbarSettings.items
    .filter(item => item.visible)
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      label: item.name,
      url: item.url
    }));

  // For home page, show no navigation items (only login, weather, language)
  // For resource pages, show all navigation items
  const navItems = isHomePage ? [] : allNavItems;

  return {
    isOpen,
    setIsOpen,
    scrolled,
    user,
    navigate,
    location,
    config,
    handleSignOut,
    handleNavigation,
    navItems,
    isHomePage
  };
};
