
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslations } from "@/hooks/useTranslations";
import { getVirtualTourLocations, virtualTourTexts } from "@/data/virtualTourData";
import MetaversePreview from "@/components/virtual-tour/MetaversePreview";
import MetaverseGuide from "@/components/virtual-tour/MetaverseGuide";

type VirtualTourProps = {
  className?: string;
};

const VirtualTour = ({ className }: VirtualTourProps) => {
  const [activeLocation, setActiveLocation] = useState(1);
  const { language } = useLanguage();
  const t = useTranslations();

  const locations = getVirtualTourLocations(language);
  const virtualTexts = virtualTourTexts[language];

  const currentLocation = locations.find(loc => loc.id === activeLocation) || locations[0];

  return (
    <section 
      id="virtual-tour" 
      className={cn("relative py-32 overflow-hidden", className)}
    >
      {/* Animated background with floating particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzlDQTNBRiIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPC9zdmc+')] opacity-30 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_2s]"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rotate-45 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-blue-300/20 rotate-12 animate-[spin_15s_linear_infinite_reverse]"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-purple-300/20 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">✨ {t.metaverseExperience}</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            {t.virtualTourTitle} <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t.virtualTourSubtitle}</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-5xl mx-auto leading-relaxed font-light">
            {t.virtualTourDescription}
          </p>
          
          {/* Decorative line */}
          <div className="mt-12 flex justify-center">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>

        <div className="mb-20">
          <MetaversePreview 
            activeLocation={currentLocation}
            texts={{
              enterMetaverse: t.enterMetaverse,
              exploreSpace: virtualTexts.exploreSpace
            }}
          />
        </div>

        <div className="mb-20">
          <MetaverseGuide
            texts={{
              tips: t.tips,
              tip1: t.useHeadphones,
              tip2: t.fullscreen,
              tip3: t.goodConnection
            }}
          />
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </section>
  );
};

export default VirtualTour;
