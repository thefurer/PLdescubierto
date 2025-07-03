import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';
import { useVisualConfig } from '@/hooks/useVisualConfig';

const VisualPreview = () => {
  const { config } = useVisualConfig();
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

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

  return (
    <Card>
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
              className="h-16 flex items-center justify-between px-4 border-b"
              style={{ 
                backgroundColor: config.navbarSettings.backgroundColor,
                color: config.navbarSettings.textColor 
              }}
            >
              <div className="flex items-center">
                <div 
                  className="font-bold text-lg"
                  style={{ 
                    color: config.navbarSettings.textColor,
                    height: `${config.logoSettings.height}px`,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Puerto López
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {config.navbarSettings.items
                  .filter(item => item.visible)
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 4)
                  .map((item) => (
                    <span 
                      key={item.name} 
                      className="text-sm"
                      style={{ color: config.navbarSettings.textColor }}
                    >
                      {item.name}
                    </span>
                  ))}
              </div>
            </div>

            {/* Content Preview */}
            <div className="p-4 space-y-4" style={{ backgroundColor: config.colorPalette.background }}>
              {/* Hero Section */}
              <div className="text-center space-y-3">
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: config.typography.headingColor }}
                >
                  Bienvenido a Puerto López
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: config.typography.bodyColor }}
                >
                  Descubre la belleza natural del Pacífico ecuatoriano
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    style={{ 
                      backgroundColor: config.buttonStyles.primaryColor,
                      borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                                   config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px'
                    }}
                  >
                    Explorar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ 
                      borderColor: config.buttonStyles.secondaryColor,
                      color: config.buttonStyles.secondaryColor,
                      borderRadius: config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                                   config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px'
                    }}
                  >
                    Más Info
                  </Button>
                </div>
              </div>

              {/* Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded p-3 bg-card">
                  <h3 
                    className="font-semibold mb-2 text-sm"
                    style={{ color: config.typography.headingColor }}
                  >
                    Avistamiento de Ballenas
                  </h3>
                  <p 
                    className="text-xs mb-2"
                    style={{ color: config.typography.bodyColor }}
                  >
                    Experiencia única observando ballenas jorobadas.
                  </p>
                  <a 
                    href="#" 
                    className="text-xs underline"
                    style={{ color: config.typography.linkColor }}
                  >
                    Leer más
                  </a>
                </div>
                <div className="border rounded p-3 bg-card">
                  <h3 
                    className="font-semibold mb-2 text-sm"
                    style={{ color: config.typography.headingColor }}
                  >
                    Playa Los Frailes
                  </h3>
                  <p 
                    className="text-xs mb-2"
                    style={{ color: config.typography.bodyColor }}
                  >
                    Una de las playas más hermosas del Ecuador.
                  </p>
                  <a 
                    href="#" 
                    className="text-xs underline"
                    style={{ color: config.typography.linkColor }}
                  >
                    Leer más
                  </a>
                </div>
              </div>

              {/* Color Palette Display */}
              <div className="border rounded p-3 bg-card">
                <h4 className="text-xs font-medium mb-2">Paleta de Colores Actual</h4>
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