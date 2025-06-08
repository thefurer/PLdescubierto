
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
      className={cn("py-24 bg-gradient-to-b from-ocean-light/20 via-ocean/15 to-ocean/25", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t.title} <span className="text-ocean">{t.subtitle}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
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
