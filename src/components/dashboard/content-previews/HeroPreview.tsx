
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
      <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
          {/* Main Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {content.title || "Puerto López"}
          </h1>
          
          {/* Subtitle with green accent */}
          <h2 className="text-lg md:text-xl font-bold text-green-600 mb-3">
            {content.subtitle || "Descubre sus Atracciones"}
          </h2>
          
          {/* Description */}
          <p className="text-sm text-gray-700 mb-4">
            {content.description || "Bellezas Naturales y Culturales"}
          </p>

          {/* Action Buttons Preview */}
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg">
              Explorar Atracciones
            </div>
            <div className="px-3 py-1 bg-gray-700 text-white text-xs rounded-lg">
              Experiencia Virtual
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeroPreview;
