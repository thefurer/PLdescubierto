
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentManager } from "@/hooks/useContentManager";
import LanguageToggle from "./accessibility/LanguageToggle";

const Hero = () => {
  const { language } = useLanguage();
  const { content } = useContentManager();

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
    <section id="home" className="relative h-screen overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Language Toggle - positioned in the middle-right of the screen */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20">
        <LanguageToggle />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
            {currentTexts.title}
          </h1>
          
          {/* Subtitle with green accent */}
          <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-6">
            {currentTexts.subtitle}
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12">
            {currentTexts.description}
          </p>

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
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              {currentTexts.virtualBtn}
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-gray-300">
          <ArrowDown size={28} className="text-gray-600" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
