
import { Card } from "@/components/ui/card";
import { useVisualConfig } from "@/hooks/useVisualConfig";

interface HeroPreviewProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
  };
}

const HeroPreview = ({ content }: HeroPreviewProps) => {
  const { config } = useVisualConfig();

  return (
    <Card className="overflow-hidden border border-border">
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: content.backgroundImage 
            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${content.backgroundImage}')`
            : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`
        }}
      >
        {/* Logo Preview */}
        {config.logoSettings.logoUrl && (
          <div className="absolute top-4 left-4">
            <img 
              src={config.logoSettings.logoUrl}
              alt="Logo"
              className="object-contain brightness-0 invert"
              style={{ height: `${Math.min(config.logoSettings.height, 32)}px` }}
            />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
          {/* Main Title */}
          <h1 
            className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg"
            style={{ 
              fontFamily: config.typography.fontFamily,
              color: config.colorPalette.primary || '#ffffff'
            }}
          >
            {content.title || "Puerto López"}
          </h1>
          
          {/* Subtitle with accent color */}
          <h2 
            className="text-lg md:text-xl font-bold mb-3 drop-shadow-lg"
            style={{ 
              fontFamily: config.typography.fontFamily,
              color: config.colorPalette.accent || '#10b981'
            }}
          >
            {content.subtitle || "Descubre sus Atracciones"}
          </h2>
          
          {/* Description */}
          <p 
            className="text-sm mb-4 drop-shadow-lg"
            style={{ 
              fontFamily: config.typography.fontFamily,
              color: config.colorPalette.text || '#ffffff'
            }}
          >
            {content.description || "Bellezas Naturales y Culturales"}
          </p>

          {/* Navigation Menu Preview */}
          <div className="flex gap-1 mb-3 flex-wrap justify-center">
            {config.navbarSettings.items.filter(item => item.visible).map((item, index) => (
              <div 
                key={index}
                className="px-2 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded"
                style={{ 
                  backgroundColor: `${config.navbarSettings.backgroundColor}20`,
                  color: config.navbarSettings.textColor || '#ffffff'
                }}
              >
                {item.name}
              </div>
            ))}
          </div>

          {/* Action Buttons Preview */}
          <div className="flex gap-2">
            <div 
              className="px-3 py-1 text-white text-xs"
              style={{ 
                backgroundColor: config.buttonStyles.primaryColor || '#2563eb',
                borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                             config.buttonStyles.primaryStyle === 'square' ? '2px' : '8px'
              }}
            >
              Explorar Atracciones
            </div>
            <div 
              className="px-3 py-1 text-white text-xs"
              style={{ 
                backgroundColor: config.buttonStyles.secondaryColor || '#10b981',
                borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                             config.buttonStyles.primaryStyle === 'square' ? '2px' : '8px'
              }}
            >
              Experiencia Virtual
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeroPreview;
