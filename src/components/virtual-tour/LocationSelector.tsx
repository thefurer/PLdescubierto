
import { Monitor, Compass, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VirtualTourLocation } from "@/data/virtualTourData";

type LocationSelectorProps = {
  locations: VirtualTourLocation[];
  activeLocation: number;
  onLocationSelect: (id: number) => void;
  texts: {
    tips: string;
    tip1: string;
    tip2: string;
    tip3: string;
  };
};

const LocationSelector = ({ 
  locations, 
  activeLocation, 
  onLocationSelect, 
  texts 
}: LocationSelectorProps) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-blue-400/20 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Monitor className="text-blue-400" size={24} />
        Áreas del Metaespacio
      </h3>
      
      <div className="space-y-4">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => onLocationSelect(location.id)}
            className={cn(
              "w-full p-4 rounded-xl flex items-start transition-all transform hover:scale-105",
              activeLocation === location.id 
                ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 text-white" 
                : "bg-black/20 text-white/70 hover:bg-black/40 border border-white/10"
            )}
          >
            <div className="flex-1 text-left">
              <h4 className="font-medium mb-1">{location.name}</h4>
              <p className="text-sm opacity-80 line-clamp-2">{location.description}</p>
            </div>
            <ChevronRight size={20} className={activeLocation === location.id ? "opacity-100 text-blue-400" : "opacity-50"} />
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/20">
        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
          <Compass className="text-blue-400" size={18} />
          {texts.tips}
        </h4>
        <ul className="text-white/80 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">1</span>
            <span>{texts.tip1}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">2</span>
            <span>{texts.tip2}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">3</span>
            <span>{texts.tip3}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LocationSelector;
