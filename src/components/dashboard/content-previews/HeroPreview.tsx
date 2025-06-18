
import { Card } from "@/components/ui/card";

interface HeroPreviewProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
  };
}

const HeroPreview = ({ content }: HeroPreviewProps) => {
  const backgroundImage = content.backgroundImage || "/lovable-uploads/78e98eed-30a8-4449-aca7-86cb97de3b2e.png";
  
  return (
    <Card className="overflow-hidden border border-blue-200">
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url('${backgroundImage}')` }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
          {/* Main Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {content.title || "Puerto López"}
          </h1>
          
          {/* Subtitle with green accent */}
          <h2 className="text-lg md:text-xl font-bold text-green-400 mb-3 drop-shadow-lg">
            {content.subtitle || "Descubre sus Atracciones"}
          </h2>
          
          {/* Description */}
          <p className="text-sm text-white/95 drop-shadow-lg mb-4">
            {content.description || "Bellezas Naturales y Culturales"}
          </p>

          {/* Navigation Menu Preview */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 mb-3 border border-white/20">
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <div className="px-3 py-1 text-white rounded-lg">Inicio</div>
              <div className="px-3 py-1 text-white rounded-lg">Atracciones</div>
              <div className="px-3 py-1 text-white rounded-lg">Guía de Viaje</div>
              <div className="px-3 py-1 text-white rounded-lg">Planificar</div>
            </div>
          </div>

          {/* Action Buttons Preview */}
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg">
              Explorar Atracciones
            </div>
            <div className="px-3 py-1 bg-gray-700/80 text-white text-xs rounded-lg border border-white/30">
              Experiencia Virtual
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeroPreview;
