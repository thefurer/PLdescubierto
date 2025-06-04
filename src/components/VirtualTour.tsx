
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { getVirtualTourLocations, virtualTourTexts } from "@/data/virtualTourData";
import MetaversePreview from "@/components/virtual-tour/MetaversePreview";
import LocationSelector from "@/components/virtual-tour/LocationSelector";
import FeatureCards from "@/components/virtual-tour/FeatureCards";

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
      className={cn("py-20 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title} <span className="text-cyan-400">{t.subtitle}</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <MetaversePreview 
            activeLocation={currentLocation}
            texts={{
              enterMetaverse: t.enterMetaverse,
              exploreSpace: t.exploreSpace
            }}
          />

          <LocationSelector
            locations={locations}
            activeLocation={activeLocation}
            onLocationSelect={setActiveLocation}
            texts={{
              tips: t.tips,
              tip1: t.tip1,
              tip2: t.tip2,
              tip3: t.tip3
            }}
          />
        </div>

        <FeatureCards
          texts={{
            interactive: t.interactive,
            interactiveDesc: t.interactiveDesc,
            social: t.social,
            socialDesc: t.socialDesc,
            immersive: t.immersive,
            immersiveDesc: t.immersiveDesc,
            explore: t.explore
          }}
        />
      </div>
    </section>
  );
};

export default VirtualTour;
