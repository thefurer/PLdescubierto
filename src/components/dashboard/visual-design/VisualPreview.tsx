
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useVisualConfig } from '@/hooks/useVisualConfig';

const VisualPreview = () => {
  const { config } = useVisualConfig();
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  // Force re-render when config changes
  useEffect(() => {
    const handleConfigUpdate = () => {
      setKey(prev => prev + 1);
    };
    
    window.addEventListener('visual-config-updated', handleConfigUpdate);
    return () => window.removeEventListener('visual-config-updated', handleConfigUpdate);
  }, []);

  const getDeviceStyles = () => {
    switch (devicePreview) {
      case 'mobile':
        return 'w-80 h-96';
      case 'tablet':
        return 'w-96 h-80';
      default:
        return 'w-full h-96';
    }
  };

  const DeviceIcon = devicePreview === 'desktop' ? Monitor : devicePreview === 'tablet' ? Tablet : Smartphone;

  const getLogoAlignment = () => {
    switch (config.logoSettings.position) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  };

  return (
    <Card key={key}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vista Previa del Sitio</CardTitle>
            <CardDescription>
              Previsualiza cómo se verán los cambios en tiempo real
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setKey(prev => prev + 1)}
              title="Actualizar vista previa"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('tablet')}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={devicePreview === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDevicePreview('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className={`${getDeviceStyles()} border-2 border-muted rounded-lg overflow-hidden bg-background shadow-lg`}>
            {/* Navbar Preview */}
            <div 
              className={`h-16 flex items-center px-4 border-b ${getLogoAlignment()}`}
              style={{ 
                backgroundColor: config.navbarSettings.backgroundColor,
                color: config.navbarSettings.textColor 
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`flex items-center ${getLogoAlignment()}`}>
                  {config.logoSettings.logoUrl ? (
                    <img 
                      src={config.logoSettings.logoUrl} 
                      alt="Logo preview" 
                      className="object-contain"
                      style={{ height: `${config.logoSettings.height}px` }}
                    />
                  ) : (
                    <div 
                      className="font-bold flex items-center"
                      style={{ 
                        color: config.navbarSettings.textColor,
                        height: `${config.logoSettings.height}px`,
                        fontSize: `${Math.max(config.logoSettings.height * 0.6, 16)}px`,
                        fontFamily: config.typography.fontFamily
                      }}
                    >
                      Puerto López
                    </div>
                  )}
                </div>
                {devicePreview === 'desktop' && (
                  <div className="hidden md:flex items-center space-x-4">
                    {config.navbarSettings.items
                      .filter(item => item.visible)
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 4)
                      .map((item) => (
                        <span 
                          key={item.name} 
                          className="text-sm"
                          style={{ 
                            color: config.navbarSettings.textColor,
                            fontFamily: config.typography.fontFamily
                          }}
                        >
                          {item.name}
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 space-y-4" style={{ backgroundColor: config.colorPalette.background }}>
              {/* Hero Section */}
              <div className="text-center space-y-3">
                <h1 
                  className="text-2xl font-bold"
                  style={{ 
                    color: config.typography.headingColor,
                    fontFamily: config.typography.fontFamily
                  }}
                >
                  Bienvenido a Puerto López
                </h1>
                <p 
                  className="text-sm"
                  style={{ 
                    color: config.typography.bodyColor,
                    fontFamily: config.typography.fontFamily
                  }}
                >
                  Descubre la belleza natural del Pacífico ecuatoriano
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    className="px-4 py-2 text-sm text-white font-medium transition-all"
                    style={{ 
                      backgroundColor: config.buttonStyles.primaryColor,
                      borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                                   config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px',
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Explorar
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium transition-all bg-transparent"
                    style={{ 
                      borderColor: config.buttonStyles.secondaryColor,
                      color: config.buttonStyles.secondaryColor,
                      border: `2px solid ${config.buttonStyles.secondaryColor}`,
                      borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                                   config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px',
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Más Info
                  </button>
                </div>
              </div>

              {/* Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded p-3 bg-card">
                  <h3 
                    className="font-semibold mb-2 text-sm"
                    style={{ 
                      color: config.typography.headingColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Avistamiento de Ballenas
                  </h3>
                  <p 
                    className="text-xs mb-2"
                    style={{ 
                      color: config.typography.bodyColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Experiencia única observando ballenas jorobadas.
                  </p>
                  <a 
                    href="#" 
                    className="text-xs underline"
                    style={{ 
                      color: config.typography.linkColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Leer más
                  </a>
                </div>
                <div className="border rounded p-3 bg-card">
                  <h3 
                    className="font-semibold mb-2 text-sm"
                    style={{ 
                      color: config.typography.headingColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Playa Los Frailes
                  </h3>
                  <p 
                    className="text-xs mb-2"
                    style={{ 
                      color: config.typography.bodyColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Una de las playas más hermosas del Ecuador.
                  </p>
                  <a 
                    href="#" 
                    className="text-xs underline"
                    style={{ 
                      color: config.typography.linkColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Leer más
                  </a>
                </div>
              </div>

              {/* Color Palette Display */}
              <div className="border rounded p-3 bg-card">
                <h4 className="text-xs font-medium mb-2" style={{ fontFamily: config.typography.fontFamily }}>
                  Paleta de Colores Actual
                </h4>
                <div className="flex gap-1">
                  {Object.entries(config.colorPalette).map(([key, color]) => (
                    <div
                      key={key}
                      className="w-6 h-6 rounded border flex-shrink-0"
                      style={{ backgroundColor: color }}
                      title={key}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Badge variant="outline" className="flex items-center gap-2">
            <DeviceIcon className="h-3 w-3" />
            Vista {devicePreview === 'desktop' ? 'Escritorio' : devicePreview === 'tablet' ? 'Tablet' : 'Móvil'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualPreview;
