
import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentManager } from "@/hooks/useContentManager";
import LanguageToggle from "./accessibility/LanguageToggle";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import AccessibilityButton from "./accessibility/AccessibilityButton";
import UserMenu from "./UserMenu";

const Hero = () => {
  const { language } = useLanguage();
  const { content } = useContentManager();
  const [isAccessibilityExpanded, setIsAccessibilityExpanded] = useState(false);

  // Find hero content from database
  const heroContent = content.find(item => item.section_name === 'hero')?.content;
  const texts = {
    es: {
      title: heroContent?.title || "Puerto López",
      subtitle: heroContent?.subtitle || "Descubre sus Atracciones",
      description: heroContent?.description || "Bellezas Naturales y Culturales",
      exploreBtn: "Explorar Atracciones",
      virtualBtn: "Experiencia Virtual",
      inicio: "Inicio",
      atracciones: "Atracciones", 
      guiaViaje: "Guía de Viaje",
      planificar: "Planificar Itinerario"
    },
    en: {
      title: heroContent?.title || "Puerto López",
      subtitle: heroContent?.subtitle || "Discover its Attractions",
      description: heroContent?.description || "Natural and Cultural Beauties",
      exploreBtn: "Explore Attractions",
      virtualBtn: "Virtual Experience",
      inicio: "Home",
      atracciones: "Attractions",
      guiaViaje: "Travel Guide", 
      planificar: "Plan Itinerary"
    }
  };
  const currentTexts = texts[language];
  
  return (
    <section 
      id="home" 
      className="relative h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
      }}
    >
      {/* Top navigation bar with accessibility and user menu */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          <AccessibilityButton 
            isExpanded={isAccessibilityExpanded}
            onToggle={() => setIsAccessibilityExpanded(!isAccessibilityExpanded)}
            compact={true}
          />
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <UserMenu />
        </div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <div className="max-w-4xl">
          {/* Main Title */}
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
                  <NavigationMenuLink 
                    href="/"
                    className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium"
                  >
                    {currentTexts.inicio}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="#attractions"
                    className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium"
                  >
                    {currentTexts.atracciones}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/travel-guide"
                    className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium"
                  >
                    {currentTexts.guiaViaje}
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/itinerary-planner"
                    className="text-white hover:text-green-400 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 font-medium"
                  >
                    {currentTexts.planificar}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <a 
              href="#attractions" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {currentTexts.exploreBtn}
            </a>
            <a 
              href="#virtual-tour" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {currentTexts.virtualBtn}
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
          <ArrowDown size={28} className="text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
