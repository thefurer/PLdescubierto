
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
      <div className="relative aspect-video min-h-[500px]">
        <iframe
          src="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
          className="w-full h-full"
          frameBorder="0"
          allow="camera; microphone; fullscreen; autoplay; display-capture; xr-spatial-tracking"
          allowFullScreen
          title="Puerto López Metaverse Experience"
        />
        <div className="absolute top-4 left-4 bg-gradient-to-r from-ocean to-ocean-dark text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          ✨ Metaespacio Activo
        </div>
        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
          Experiencia VR/AR Disponible
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-ocean-dark mb-4">{activeLocation.name}</h3>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
          {activeLocation.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <a 
            href="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-ocean to-ocean-dark text-white flex items-center gap-3 hover:from-ocean-dark hover:to-ocean transition-all transform hover:scale-105 font-medium shadow-lg text-lg"
          >
            <Headset size={24} />
            <span>{texts.enterMetaverse}</span>
          </a>
          <button className="px-6 py-4 rounded-full bg-ocean-light/20 backdrop-blur-sm text-ocean flex items-center gap-3 hover:bg-ocean-light/30 transition-colors border border-ocean/20 font-medium">
            <Globe size={20} />
            <span>{texts.exploreSpace}</span>
          </button>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gradient-to-br from-green-50 to-ocean-light/10 rounded-lg">
            <div className="text-2xl font-bold text-ocean">360°</div>
            <div className="text-sm text-gray-600">Vista Inmersiva</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-ocean/10 rounded-lg">
            <div className="text-2xl font-bold text-ocean">VR/AR</div>
            <div className="text-sm text-gray-600">Compatible</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-ocean-dark/10 rounded-lg">
            <div className="text-2xl font-bold text-ocean">Social</div>
            <div className="text-sm text-gray-600">Multijugador</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaversePreview;
