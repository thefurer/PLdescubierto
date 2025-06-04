
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
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-ocean/20">
      <div className="relative aspect-video">
        <iframe
          src="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
          className="w-full h-full"
          frameBorder="0"
          allow="camera; microphone; fullscreen; autoplay; display-capture; xr-spatial-tracking"
          allowFullScreen
          title="Puerto López Metaverse Experience"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-ocean to-ocean-dark text-white px-3 py-1 rounded-full text-sm font-medium">
          ✨ Metaespacio Activo
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700 mb-4">
          {activeLocation.description}
        </p>
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-ocean to-ocean-dark text-white flex items-center gap-2 hover:from-ocean-dark hover:to-ocean transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            <Headset size={20} />
            <span>{texts.enterMetaverse}</span>
          </a>
          <button className="px-4 py-3 rounded-full bg-ocean-light/20 backdrop-blur-sm text-ocean flex items-center gap-2 hover:bg-ocean-light/30 transition-colors border border-ocean/20">
            <Globe size={18} />
            <span>{texts.exploreSpace}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaversePreview;
