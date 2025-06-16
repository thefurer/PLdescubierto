
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useContentManager } from "@/hooks/useContentManager";
import LanguageToggle from "./accessibility/LanguageToggle";

const Hero = () => {
  const {
    language
  } = useLanguage();
  const {
    content
  } = useContentManager();

  // Find hero content from database
  const heroContent = content.find(item => item.section_name === 'hero')?.content;
  const texts = {
    es: {
      title: heroContent?.title || "Descubre la Magia de",
      subtitle: heroContent?.subtitle || "Puerto López",
      description: heroContent?.description || "Descubre la belleza natural, riqueza cultural y aventuras sin fin en el paraíso costero más encantador de Ecuador.",
      exploreBtn: "Explorar Atracciones",
      virtualBtn: "Experiencia Virtual"
    },
    en: {
      title: heroContent?.title || "Discover the Magic of",
      subtitle: heroContent?.subtitle || "Puerto López",
      description: heroContent?.description || "Discover the natural beauty, cultural richness, and endless adventures in Ecuador's most enchanting coastal paradise.",
      exploreBtn: "Explore Attractions",
      virtualBtn: "Virtual Experience"
    }
  };
  const currentTexts = texts[language];
  // Updated to a stunning 360-degree beach panorama that captures the essence of Puerto López
  const backgroundImage = heroContent?.backgroundImage || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=7372&h=4392";
  
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Language Toggle - positioned in the middle-right of the screen */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20">
        <LanguageToggle />
      </div>

      {/* Hero Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundPosition: "center 30%"
      }}>
        {/* Black transparency overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/40 via-ocean/20 to-green-primary/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-green-primary/5"></div>
      </div>

      {/* Enhanced Wave Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg className="absolute bottom-0 w-[200%] h-full translate-x-0 animate-wave" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{
                stopColor: "white",
                stopOpacity: 1
              }} />
              <stop offset="50%" style={{
                stopColor: "hsl(var(--green-light))",
                stopOpacity: 0.1
              }} />
              <stop offset="100%" style={{
                stopColor: "white",
                stopOpacity: 1
              }} />
            </linearGradient>
          </defs>
          <path d="M0,0 C150,40 350,0 500,30 C650,60 850,20 1000,50 L1000,100 L0,100 Z" fill="url(#waveGradient)"></path>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            <span className="block leading-tight">{currentTexts.title}</span>
            <span className="text-green-primary drop-shadow-2xl bg-gradient-to-r from-green-primary to-green-light bg-clip-text text-[#1080c6]">
              {currentTexts.subtitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-10 drop-shadow-lg max-w-3xl leading-relaxed">
            {currentTexts.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
            <a href="#attractions" className="btn-primary text-center transform hover:scale-105">
              {currentTexts.exploreBtn}
            </a>
            <a href="#virtual-tour" className="btn-ghost text-center transform hover:scale-105">
              {currentTexts.virtualBtn}
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        <div className="glass-card rounded-full p-2">
          <ArrowDown size={28} className="text-green-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
