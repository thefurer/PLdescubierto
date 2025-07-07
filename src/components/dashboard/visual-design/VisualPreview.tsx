
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet, RefreshCw, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useVisualConfig } from '@/hooks/useVisualConfig';

const VisualPreview = () => {
  const { config, previewMode } = useVisualConfig();
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
        return 'w-80 h-[500px]';
      case 'tablet':
        return 'w-[450px] h-[600px]';
      default:
        return 'w-full h-[600px] max-w-[800px]';
    }
  };

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

  const getButtonStyle = (isPrimary = true) => {
    let borderRadius = '8px'; // default rounded
    
    if (config.buttonStyles.primaryStyle === 'pill') {
      borderRadius = '9999px';
    } else if (config.buttonStyles.primaryStyle === 'square') {
      borderRadius = '4px';
    }

    const baseStyle = {
      borderRadius,
      transition: 'all 0.2s ease-in-out',
      padding: '12px 24px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontFamily: config.typography.fontFamily,
    };

    if (isPrimary) {
      return {
        ...baseStyle,
        backgroundColor: config.buttonStyles.primaryColor,
        color: 'white',
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: config.buttonStyles.secondaryColor,
        border: `2px solid ${config.buttonStyles.secondaryColor}`,
      };
    }
  };

  const applyHoverEffect = (element: HTMLElement, isEntering: boolean) => {
    if (!isEntering) {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
      return;
    }

    switch (config.buttonStyles.hoverEffect) {
      case 'scale':
        element.style.transform = 'scale(1.05)';
        break;
      case 'shadow':
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        break;
      case 'glow':
        element.style.boxShadow = `0 0 20px ${config.buttonStyles.primaryColor}40`;
        break;
    }
  };

  const DeviceIcon = devicePreview === 'desktop' ? Monitor : devicePreview === 'tablet' ? Tablet : Smartphone;

  return (
    <Card key={key} className="overflow-hidden border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-blue-600" />
              Vista Previa del Sitio
              {previewMode && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                  Previsualización
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Observa los cambios aplicados en tiempo real
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setKey(prev => prev + 1)}
              title="Actualizar vista previa"
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-1 mt-4">
          <Button
            variant={devicePreview === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevicePreview('desktop')}
            className="h-8 px-3"
          >
            <Monitor className="h-3 w-3 mr-1" />
            <span className="text-xs">Desktop</span>
          </Button>
          <Button
            variant={devicePreview === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevicePreview('tablet')}
            className="h-8 px-3"
          >
            <Tablet className="h-3 w-3 mr-1" />
            <span className="text-xs">Tablet</span>
          </Button>
          <Button
            variant={devicePreview === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevicePreview('mobile')}
            className="h-8 px-3"
          >
            <Smartphone className="h-3 w-3 mr-1" />
            <span className="text-xs">Móvil</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex justify-center">
          <div className={`${getDeviceStyles()} border-4 border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xl transition-all duration-300`}>
            {/* Navbar Preview */}
            <div 
              className={`h-16 flex items-center px-4 border-b-2 ${getLogoAlignment()}`}
              style={{ 
                backgroundColor: config.navbarSettings.backgroundColor,
                color: config.navbarSettings.textColor,
                borderBottomColor: `${config.navbarSettings.backgroundColor}dd`
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
                  <div className="hidden md:flex items-center space-x-6">
                    {config.navbarSettings.items
                      .filter(item => item.visible)
                      .sort((a, b) => a.order - b.order)
                      .slice(0, 4)
                      .map((item) => (
                        <span 
                          key={item.name} 
                          className="text-sm font-medium hover:opacity-80 cursor-pointer transition-opacity"
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
            <div className="p-6 space-y-6 overflow-y-auto" style={{ backgroundColor: config.colorPalette.background, height: 'calc(100% - 64px)' }}>
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h1 
                  className="text-3xl font-bold leading-tight"
                  style={{ 
                    color: config.typography.headingColor,
                    fontFamily: config.typography.fontFamily
                  }}
                >
                  Bienvenido a Puerto López
                </h1>
                <p 
                  className="text-lg leading-relaxed"
                  style={{ 
                    color: config.typography.bodyColor,
                    fontFamily: config.typography.fontFamily
                  }}
                >
                  Descubre la belleza natural del Pacífico ecuatoriano
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    style={getButtonStyle(true)}
                    onMouseEnter={(e) => applyHoverEffect(e.currentTarget, true)}
                    onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false)}
                  >
                    Explorar
                  </button>
                  <button
                    style={getButtonStyle(false)}
                    onMouseEnter={(e) => applyHoverEffect(e.currentTarget, true)}
                    onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false)}
                  >
                    Más Info
                  </button>
                </div>
              </div>

              {/* Content Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{ 
                    backgroundColor: config.colorPalette.card,
                    border: `1px solid ${config.colorPalette.border}`
                  }}
                >
                  <h3 
                    className="font-bold mb-3 text-lg"
                    style={{ 
                      color: config.typography.headingColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Avistamiento de Ballenas
                  </h3>
                  <p 
                    className="text-sm mb-3 leading-relaxed"
                    style={{ 
                      color: config.typography.bodyColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Experiencia única observando ballenas jorobadas en su hábitat natural.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm underline font-medium hover:opacity-80 transition-opacity"
                    style={{ 
                      color: config.typography.linkColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Leer más →
                  </a>
                </div>
                <div 
                  className="rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{ 
                    backgroundColor: config.colorPalette.card,
                    border: `1px solid ${config.colorPalette.border}`
                  }}
                >
                  <h3 
                    className="font-bold mb-3 text-lg"
                    style={{ 
                      color: config.typography.headingColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Playa Los Frailes
                  </h3>
                  <p 
                    className="text-sm mb-3 leading-relaxed"
                    style={{ 
                      color: config.typography.bodyColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Una de las playas más hermosas del Ecuador con aguas cristalinas.
                  </p>
                  <a 
                    href="#" 
                    className="text-sm underline font-medium hover:opacity-80 transition-opacity"
                    style={{ 
                      color: config.typography.linkColor,
                      fontFamily: config.typography.fontFamily
                    }}
                  >
                    Leer más →
                  </a>
                </div>
              </div>

              {/* Color Palette Display & Button Style Demo */}
              <div 
                className="rounded-xl p-4 shadow-sm space-y-4"
                style={{ backgroundColor: config.colorPalette.card }}
              >
                <h4 className="text-sm font-bold mb-3" style={{ fontFamily: config.typography.fontFamily }}>
                  Vista de Elementos Personalizados
                </h4>
                
                {/* Button Styles Demo */}
                <div className="space-y-2">
                  <p className="text-xs font-medium" style={{ color: config.colorPalette.muted }}>
                    Estilos de Botones ({config.buttonStyles.primaryStyle === 'pill' ? 'Píldora' : 
                                      config.buttonStyles.primaryStyle === 'square' ? 'Cuadrado' : 'Redondeado'}):
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      style={getButtonStyle(true)}
                      onMouseEnter={(e) => applyHoverEffect(e.currentTarget, true)}
                      onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false)}
                      className="text-xs px-3 py-1"
                    >
                      Primario
                    </button>
                    <button
                      style={getButtonStyle(false)}
                      onMouseEnter={(e) => applyHoverEffect(e.currentTarget, true)}
                      onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false)}
                      className="text-xs px-3 py-1"
                    >
                      Secundario
                    </button>
                  </div>
                </div>

                {/* Color Palette Display */}
                <div>
                  <p className="text-xs font-medium mb-2" style={{ color: config.colorPalette.muted }}>
                    Paleta de Colores Actual:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(config.colorPalette).slice(0, 8).map(([key, color]) => (
                      <div key={key} className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 h-6 rounded-full border shadow-sm"
                          style={{ 
                            backgroundColor: color,
                            borderColor: config.colorPalette.border
                          }}
                          title={`${key}: ${color}`}
                        />
                        <span 
                          className="text-xs font-medium capitalize"
                          style={{ color: config.typography.bodyColor }}
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
            <DeviceIcon className="h-3 w-3" />
            Vista {devicePreview === 'desktop' ? 'Escritorio' : devicePreview === 'tablet' ? 'Tablet' : 'Móvil'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualPreview;
