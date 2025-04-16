
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80')",
          backgroundPosition: "center 30%"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/30 via-ocean-dark/20 to-transparent"></div>
      </div>

      {/* Animated Wave Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg 
          className="absolute bottom-0 w-[200%] h-full translate-x-0 animate-wave"
          viewBox="0 0 1000 100" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 C150,40 350,0 500,30 C650,60 850,20 1000,50 L1000,100 L0,100 Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="block">Discover the Magic of</span>
            <span className="text-coral drop-shadow-lg">Puerto Lopez</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-md max-w-2xl">
            Unveil the natural beauty, cultural richness, and endless adventures of Ecuador's most enchanting coastal paradise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#attractions" 
              className="px-8 py-3 rounded-full bg-coral hover:bg-coral/90 text-white font-semibold transition-colors shadow-lg focus:ring-2 focus:ring-coral/50 text-center"
            >
              Explore Attractions
            </a>
            <a 
              href="#virtual-tour" 
              className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold transition-colors shadow-lg focus:ring-2 focus:ring-white/20 text-center"
            >
              Virtual Experience
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        <ArrowDown size={36} />
      </div>
    </section>
  );
};

export default Hero;
