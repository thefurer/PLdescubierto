
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

const FeatureCards = ({ texts }: FeatureCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-all border border-cyan-400/20 hover:border-cyan-400/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-green-600 flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <h4 className="text-white font-bold text-lg">{texts.interactive}</h4>
        </div>
        <p className="text-white/70 mb-4">{texts.interactiveDesc}</p>
        <button className="text-cyan-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-medium">
          {texts.explore} <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-all border border-green-400/20 hover:border-green-400/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-ocean flex items-center justify-center">
            <Headset className="text-white" size={24} />
          </div>
          <h4 className="text-white font-bold text-lg">{texts.social}</h4>
        </div>
        <p className="text-white/70 mb-4">{texts.socialDesc}</p>
        <button className="text-green-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-medium">
          {texts.explore} <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-all border border-blue-400/20 hover:border-blue-400/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ocean to-green-600 flex items-center justify-center">
            <Video className="text-white" size={24} />
          </div>
          <h4 className="text-white font-bold text-lg">{texts.immersive}</h4>
        </div>
        <p className="text-white/70 mb-4">{texts.immersiveDesc}</p>
        <button className="text-blue-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-medium">
          {texts.explore} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FeatureCards;
