
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
  const backgroundImage = content.backgroundImage || "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80";
  
  return (
    <Card className="overflow-hidden border border-blue-200">
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url('${backgroundImage}')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/40 via-ocean/20 to-green-primary/10"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            <span className="block">{content.title || "Título del Hero"}</span>
            {content.subtitle && (
              <span className="text-green-primary">{content.subtitle}</span>
            )}
          </h1>
          <p className="text-sm md:text-base text-white/95 drop-shadow-lg max-w-md">
            {content.description || "Descripción del hero"}
          </p>
          <div className="flex gap-2 mt-4">
            <div className="px-3 py-1 bg-green-primary text-white text-xs rounded-full">
              Explorar Atracciones
            </div>
            <div className="px-3 py-1 bg-white/20 text-white text-xs rounded-full border border-white/30">
              Experiencia Virtual
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeroPreview;
