
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
  return (
    <Card className="overflow-hidden border border-blue-200">
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
        }}
      >
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
          <p className="text-sm text-white mb-4 drop-shadow-lg">
            {content.description || "Bellezas Naturales y Culturales"}
          </p>

          {/* Navigation Menu Preview */}
          <div className="flex gap-1 mb-3 flex-wrap justify-center">
            <div className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded">
              Inicio
            </div>
            <div className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded">
              Atracciones
            </div>
            <div className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded">
              Guía de Viaje
            </div>
            <div className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded">
              Planificar
            </div>
          </div>

          {/* Action Buttons Preview */}
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg">
              Explorar Atracciones
            </div>
            <div className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg">
              Experiencia Virtual
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeroPreview;
