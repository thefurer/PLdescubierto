
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { getVirtualTourLocations, virtualTourTexts } from "@/data/virtualTourData";
import MetaversePreview from "@/components/virtual-tour/MetaversePreview";
import LocationSelector from "@/components/virtual-tour/LocationSelector";

type VirtualTourProps = {
  className?: string;
};

const VirtualTour = ({ className }: VirtualTourProps) => {
  const [activeLocation, setActiveLocation] = useState(1);
  const { language } = useLanguage();

  const locations = getVirtualTourLocations(language);
  const t = virtualTourTexts[language];

  const currentLocation = locations.find(loc => loc.id === activeLocation) || locations[0];

  return (
    <section 
      id="virtual-tour" 
      className={cn("relative py-32 overflow-hidden", className)}
    >
      {/* Animated background with floating particles - using theme colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark/20 via-background to-ocean-blue/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iaHNsKHZhcigtLW9jZWFuLWJsdWUpKSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-ocean-blue/5 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ocean-light/5 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_2s]"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-ocean-blue/20 rotate-45 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-ocean-light/20 rotate-12 animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-primary/20 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-ocean-blue/20 mb-8">
            <div className="w-2 h-2 bg-tropical rounded-full mr-3 animate-pulse"></div>
            <span className="text-ocean-dark/90 text-sm font-medium">✨ Experiencia Virtual Activa</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-ocean-dark via-ocean-blue to-primary bg-clip-text text-transparent leading-tight">
            {t.title} <span className="bg-gradient-to-r from-ocean-blue to-primary bg-clip-text text-transparent">{t.subtitle}</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-ocean-dark/80 max-w-5xl mx-auto leading-relaxed font-light">
            {t.description}
          </p>
          
          {/* Decorative line */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-ocean-blue/30 to-transparent"></div>
          </div>
        </div>

        {/* Full width metaverse preview */}
        <div className="mb-20">
          <MetaversePreview 
            activeLocation={currentLocation}
            texts={{
              enterMetaverse: t.enterMetaverse,
              exploreSpace: t.exploreSpace
            }}
          />
        </div>

        {/* Interactive guide cards at the bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl border border-ocean-blue/20 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-ocean-blue/10">
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-ocean-blue to-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🥽</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-ocean-dark">{t.interactive}</h3>
              <p className="text-ocean-dark/70 leading-relaxed">{t.interactiveDesc}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ocean-light/20 to-transparent rounded-full blur-2xl"></div>
          </div>

          <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl border border-ocean-blue/20 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-ocean-blue/10">
            <div className="absolute inset-0 bg-gradient-to-br from-tropical/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-tropical to-tropical-light rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-ocean-dark">{t.social}</h3>
              <p className="text-ocean-dark/70 leading-relaxed">{t.socialDesc}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-tropical/20 to-transparent rounded-full blur-2xl"></div>
          </div>

          <div className="group relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl border border-ocean-blue/20 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-ocean-blue/10">
            <div className="absolute inset-0 bg-gradient-to-br from-coral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-coral to-sunset rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-ocean-dark">{t.immersive}</h3>
              <p className="text-ocean-dark/70 leading-relaxed">{t.immersiveDesc}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-coral/20 to-transparent rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ocean-blue/5 to-transparent"></div>
    </section>
  );
};

export default VirtualTour;
