
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
    <div className="animate-fade-in group">
      {/* Outer glow container */}
      <div className="relative p-1 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl">
              <Monitor className="text-white" size={24} />
            </div>
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Áreas del Metaespacio
            </span>
          </h3>
          
          <div className="space-y-3 mb-8">
            {locations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => onLocationSelect(location.id)}
                className={cn(
                  "w-full p-5 rounded-2xl flex items-start transition-all transform hover:scale-[1.02] group/item border backdrop-blur-xl",
                  activeLocation === location.id 
                    ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 text-white shadow-2xl" 
                    : "bg-white/5 text-white/80 hover:bg-white/10 border-white/10 hover:border-white/20"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex-1 text-left">
                  <h4 className="font-semibold mb-2 text-lg group-hover/item:text-white transition-colors">
                    {location.name}
                  </h4>
                  <p className="text-sm opacity-80 line-clamp-2 leading-relaxed">
                    {location.description}
                  </p>
                </div>
                <div className={cn(
                  "ml-4 p-2 rounded-xl transition-all duration-300",
                  activeLocation === location.id 
                    ? "bg-white/20 text-white rotate-90" 
                    : "bg-white/5 text-white/60 group-hover/item:bg-white/10 group-hover/item:text-white group-hover/item:rotate-90"
                )}>
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>

          {/* Enhanced tips section */}
          <div className="relative p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-white/20 backdrop-blur-sm overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=')] animate-pulse"></div>
            </div>
            
            <h4 className="text-white font-bold mb-4 flex items-center gap-3 relative z-10">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl shadow-lg">
                <Compass className="text-white" size={18} />
              </div>
              {texts.tips}
            </h4>
            
            <ul className="space-y-4 relative z-10">
              {[texts.tip1, texts.tip2, texts.tip3].map((tip, index) => (
                <li key={index} className="flex items-start gap-4 group/tip">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover/tip:scale-110 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <span className="text-white/90 text-sm leading-relaxed group-hover/tip:text-white transition-colors duration-300">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
