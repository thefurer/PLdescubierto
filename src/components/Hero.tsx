
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
  const backgroundImage = heroContent?.backgroundImage || "/lovable-uploads/78e98eed-30a8-4449-aca7-86cb97de3b2e.png";
  
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Language Toggle - positioned in the middle-right of the screen */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20">
        <LanguageToggle />
      </div>

      {/* Hero Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundPosition: "center center"
      }}>
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-center">
        <div className="max-w-4xl">
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
            {currentTexts.title}
          </h1>
          
          {/* Subtitle with green accent */}
          <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-6 drop-shadow-2xl">
            {currentTexts.subtitle}
          </h2>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-white/95 mb-12 drop-shadow-lg">
            {currentTexts.description}
          </p>

          {/* Navigation Menu */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 border border-white/20">
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#home" 
                className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-medium"
              >
                {currentTexts.inicio}
              </a>
              <a 
                href="#attractions" 
                className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-medium"
              >
                {currentTexts.atracciones}
              </a>
              <a 
                href="/travel-guide" 
                className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-medium"
              >
                {currentTexts.guiaViaje}
              </a>
              <a 
                href="/itinerary-planner" 
                className="px-6 py-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 font-medium"
              >
                {currentTexts.planificar}
              </a>
            </div>
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
              className="bg-gray-700/80 hover:bg-gray-600/80 text-white px-8 py-4 rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-xl border border-white/30 backdrop-blur-sm"
            >
              {currentTexts.virtualBtn}
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
          <ArrowDown size={28} className="text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
