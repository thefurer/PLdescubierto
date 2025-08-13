import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentManager } from "@/hooks/useContentManager";
import LanguageToggle from "./accessibility/LanguageToggle";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import AccessibilityToolbar from "./accessibility/AccessibilityToolbar";
import UserMenu from "./UserMenu";
import { useAuth } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
const Hero = () => {
  const {
    language
  } = useLanguage();
  const {
    content
  } = useContentManager();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Find hero content from database
  const heroContent = content.find(item => item.section_name === 'hero')?.content;

  // Get background images array
  const backgroundImages = heroContent?.backgroundImages || [heroContent?.backgroundImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'].filter(Boolean);

  // Auto-advance carousel
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [backgroundImages.length]);
  const nextImage = () => {
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(prevIndex => prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1);
  };
  const texts = {
    es: {
      title: heroContent?.title || "Puerto López",
      subtitle: heroContent?.subtitle || "Descubre sus Atracciones",
      description: heroContent?.description || "Bellezas Naturales y Culturales",
      exploreBtn: "Explorar Atracciones",
      virtualBtn: "Experiencia Virtual",
      inicio: "Inicio",
      atracciones: "Atracciones",
      guiaViaje: "Guía de Viaje"
    },
    en: {
      title: heroContent?.title || "Puerto López",
      subtitle: heroContent?.subtitle || "Discover its Attractions",
      description: heroContent?.description || "Natural and Cultural Beauties",
      exploreBtn: "Explore Attractions",
      virtualBtn: "Virtual Experience",
      inicio: "Home",
      atracciones: "Attractions",
      guiaViaje: "Travel Guide"
    }
  };
  const currentTexts = texts[language];
  return <section id="home" className="relative h-screen overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-1000" style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${backgroundImages[currentImageIndex]}')`
  }}>
      {/* Carousel Controls */}
      {backgroundImages.length > 1 && <>
          <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300" aria-label="Imagen anterior">
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300" aria-label="Siguiente imagen">
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {backgroundImages.map((_, index) => <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'}`} aria-label={`Ir a imagen ${index + 1}`} />)}
          </div>
        </>}

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <div className="max-w-4xl">
          {/* Main Title without wave effect */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
            {currentTexts.title}
          </h1>
          
          {/* Subtitle with green accent */}
          <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-6 drop-shadow-lg">
            {currentTexts.subtitle}
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg">
            {currentTexts.description}
          </p>

          {/* Navigation Menu */}
          <div className="mb-8">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex flex-wrap justify-center gap-2 sm:gap-4">
                <NavigationMenuItem>
                  <NavigationMenuLink href="/" className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium">
                    {currentTexts.inicio}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#attractions" className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium">
                    {currentTexts.atracciones}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/travel-guide" className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium">
                    {currentTexts.guiaViaje}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <a href="#attractions" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl">
              {currentTexts.exploreBtn}
            </a>
            <a href="#virtual-tour" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl">
              {currentTexts.virtualBtn}
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        
      </div>
    </section>;
};
export default Hero;