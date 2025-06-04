
import { Users, Headset, Video, ChevronRight } from "lucide-react";

type FeatureCardsProps = {
  texts: {
    interactive: string;
    interactiveDesc: string;
    social: string;
    socialDesc: string;
    immersive: string;
    immersiveDesc: string;
    explore: string;
  };
};

const FeatureCards = ({
  texts
}: FeatureCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/70 transition-all border border-ocean/20 hover:border-ocean/40 shadow-lg hover:shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ocean to-ocean-dark flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <h4 className="text-gray-800 font-bold text-lg">{texts.interactive}</h4>
        </div>
        <p className="text-gray-600 mb-4">{texts.interactiveDesc}</p>
        <button className="text-ocean flex items-center gap-1 hover:text-ocean-dark transition-colors text-sm font-medium">
          {texts.explore} <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/70 transition-all border border-ocean/25 hover:border-ocean/45 shadow-lg hover:shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ocean-light to-ocean flex items-center justify-center">
            <Headset className="text-white" size={24} />
          </div>
          <h4 className="text-gray-800 font-bold text-lg">{texts.social}</h4>
        </div>
        <p className="text-gray-600 mb-4">{texts.socialDesc}</p>
        <button className="text-ocean flex items-center gap-1 hover:text-ocean-dark transition-colors text-sm font-medium">
          {texts.explore} <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 hover:bg-white/70 transition-all border border-ocean/30 hover:border-ocean/50 shadow-lg hover:shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ocean-dark to-ocean flex items-center justify-center">
            <Video className="text-white" size={24} />
          </div>
          <h4 className="text-gray-800 font-bold text-lg">{texts.immersive}</h4>
        </div>
        <p className="text-gray-600 mb-4">{texts.immersiveDesc}</p>
        <button className="text-ocean flex items-center gap-1 hover:text-ocean-dark transition-colors text-sm font-medium">
          {texts.explore} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FeatureCards;
