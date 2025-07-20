
import { Headset, Globe } from "lucide-react";
import { VirtualTourLocation } from "@/data/virtualTourData";

type MetaversePreviewProps = {
  activeLocation: VirtualTourLocation;
  texts: {
    enterMetaverse: string;
    exploreSpace: string;
  };
};

const MetaversePreview = ({ activeLocation, texts }: MetaversePreviewProps) => {
  return (
    <div className="w-full group animate-fade-in">
      {/* Glowing border effect */}
      <div className="relative p-1 bg-gradient-to-r from-ocean-blue/20 via-primary/20 to-ocean-light/20 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-blue/30 via-primary/30 to-ocean-light/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
          <div className="relative aspect-video min-h-[500px] overflow-hidden">
            <iframe
              src="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
              className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
              frameBorder="0"
              allow="camera; microphone; fullscreen; autoplay; display-capture; xr-spatial-tracking"
              allowFullScreen
              title="Puerto López Metaverse Experience"
            />
            
            {/* Holographic overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/10 via-transparent to-primary/10 pointer-events-none"></div>
            
            {/* Status badges with enhanced styling */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="bg-gradient-to-r from-tropical to-tropical-light text-white px-4 py-2 rounded-full text-sm font-semibold shadow-2xl border border-white/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  ✨ Metaespacio Activo
                </div>
              </div>
            </div>
            
            <div className="absolute top-6 right-6">
              <div className="bg-ocean-dark/30 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm border border-ocean-blue/20 shadow-2xl">
                🥽 VR/AR Disponible
              </div>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-ocean-blue/40 rounded-full animate-ping"></div>
              <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-ocean-light/60 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary/30 rounded-full animate-bounce"></div>
            </div>
          </div>
          
          <div className="p-8 bg-gradient-to-br from-white/5 to-white/10">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-ocean-dark to-ocean-blue bg-clip-text text-transparent">
              {activeLocation.name}
            </h3>
            <p className="text-ocean-dark/80 mb-8 leading-relaxed text-lg font-light">
              {activeLocation.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative px-8 py-4 rounded-2xl bg-gradient-to-r from-ocean-blue to-primary text-white flex items-center gap-3 hover:from-ocean-dark hover:to-ocean-blue transition-all transform hover:scale-105 font-semibold text-lg shadow-2xl border border-ocean-blue/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                <Headset size={24} className="relative z-10" />
                <span className="relative z-10">{texts.enterMetaverse}</span>
              </a>
              
              <button className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-xl text-ocean-dark flex items-center gap-3 hover:bg-white/20 transition-all border border-ocean-blue/20 font-semibold hover:scale-105 transform duration-300">
                <Globe size={20} />
                <span>{texts.exploreSpace}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="group/feature p-6 bg-gradient-to-br from-ocean-blue/20 to-ocean-light/20 rounded-2xl border border-ocean-blue/20 backdrop-blur-sm hover:from-ocean-blue/30 hover:to-ocean-light/30 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-ocean-dark mb-2">360°</div>
                <div className="text-sm text-ocean-dark/70 font-medium">Vista Inmersiva</div>
              </div>
              <div className="group/feature p-6 bg-gradient-to-br from-primary/20 to-ocean-blue/20 rounded-2xl border border-ocean-blue/20 backdrop-blur-sm hover:from-primary/30 hover:to-ocean-blue/30 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-ocean-dark mb-2">VR/AR</div>
                <div className="text-sm text-ocean-dark/70 font-medium">Compatible</div>
              </div>
              <div className="group/feature p-6 bg-gradient-to-br from-tropical/20 to-tropical-light/20 rounded-2xl border border-ocean-blue/20 backdrop-blur-sm hover:from-tropical/30 hover:to-tropical-light/30 transition-all duration-300 hover:scale-105">
                <div className="text-3xl font-bold text-ocean-dark mb-2">Social</div>
                <div className="text-sm text-ocean-dark/70 font-medium">Multijugador</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaversePreview;
