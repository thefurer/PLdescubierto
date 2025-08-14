
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Palette, RefreshCw, Eye, EyeOff, Info } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { VisualConfig } from '@/types/visualConfig';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (newColor: string) => void;
  description?: string;
  usage?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange, description, usage }) => {
  // Ensure we have a valid color value
  const safeColor = color || '#000000';
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor={label} className="text-sm font-medium">
          {label}
        </Label>
        {usage && (
          <Badge variant="outline" className="text-xs">
            {usage}
          </Badge>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="color"
            id={label}
            value={safeColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-8 rounded-md border-2 border-gray-200 shadow-sm cursor-pointer"
          />
          <div 
            className="absolute inset-0 rounded-md border-2 border-gray-200 pointer-events-none"
            style={{ backgroundColor: safeColor }}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={safeColor}
            onChange={(e) => {
              const value = e.target.value;
              // Validate hex color format
              if (/^#[0-9A-Fa-f]{6}$/.test(value) || value === '') {
                onChange(value || '#000000');
              }
            }}
            className="w-full px-3 py-1 text-sm border rounded-md font-mono"
            placeholder="#000000"
          />
        </div>
      </div>
      {description && (
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <Info className="h-3 w-3" />
          {description}
        </p>
      )}
    </div>
  );
};

const colorCategories = {
  main: {
    title: 'Colores Principales',
    colors: [
      { key: 'primary', label: 'Primario', description: 'Color principal de la marca', usage: 'Botones, enlaces' },
      { key: 'secondary', label: 'Secundario', description: 'Color secundario de apoyo', usage: 'Botones alt' },
      { key: 'accent', label: 'Acento', description: 'Para destacar elementos importantes', usage: 'Badges, alertas' },
    ]
  },
  layout: {
    title: 'Estructura y Navegación',
    colors: [
      { key: 'background', label: 'Fondo Principal', description: 'Color de fondo de la página', usage: 'Body' },
      { key: 'navbar', label: 'Navbar', description: 'Fondo de la barra de navegación', usage: 'Header' },
      { key: 'card', label: 'Tarjetas', description: 'Fondo de tarjetas y contenedores', usage: 'Cards, modales' },
      { key: 'border', label: 'Bordes', description: 'Color de bordes y divisores', usage: 'Separadores' },
    ]
  },
  content: {
    title: 'Contenido y Texto',
    colors: [
      { key: 'text', label: 'Texto Principal', description: 'Color del texto principal', usage: 'Párrafos, títulos' },
      { key: 'muted', label: 'Texto Secundario', description: 'Texto menos prominente', usage: 'Subtítulos' },
      { key: 'link', label: 'Enlaces', description: 'Color de enlaces y navegación', usage: 'Links, nav items' },
    ]
  },
  feedback: {
    title: 'Estados y Retroalimentación',
    colors: [
      { key: 'success', label: 'Éxito', description: 'Mensajes de éxito', usage: 'Confirmaciones' },
      { key: 'warning', label: 'Advertencia', description: 'Mensajes de advertencia', usage: 'Alertas' },
      { key: 'destructive', label: 'Error', description: 'Mensajes de error', usage: 'Errores' },
      { key: 'info', label: 'Información', description: 'Mensajes informativos', usage: 'Tips, ayuda' },
    ]
  }
};

const EnhancedColorPaletteManager = () => {
  const { config, saveConfig, previewConfig, resetPreview, loading, previewMode, isInitialized } = useVisualConfig();
  
  // Helper to convert HSL to hex for color inputs
  const hslToHex = (hsl: string): string => {
    if (hsl.startsWith('#')) return hsl;
    
    const parts = hsl.split(' ');
    if (parts.length !== 3) return '#000000';
    
    const h = parseInt(parts[0]) / 360;
    const s = parseInt(parts[1]) / 100;
    const l = parseInt(parts[2]) / 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert config colors to hex for display
  const [localColorPalette, setLocalColorPalette] = useState(() => {
    const hexPalette: any = {};
    Object.entries(config.colorPalette).forEach(([key, value]) => {
      hexPalette[key] = hslToHex(value);
    });
    return hexPalette;
  });
  
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      const hexPalette: any = {};
      Object.entries(config.colorPalette).forEach(([key, value]) => {
        hexPalette[key] = hslToHex(value);
      });
      setLocalColorPalette(hexPalette);
    }
  }, [config.colorPalette, isInitialized]);

  const handleColorChange = (key: keyof VisualConfig['colorPalette'], newColor: string) => {
    const safeColor = newColor || '#000000';
    const updatedPalette = { ...localColorPalette, [key]: safeColor };
    setLocalColorPalette(updatedPalette);
    if (showPreview) {
      previewConfig({ colorPalette: updatedPalette });
    }
  };

  const handleSave = async () => {
    await saveConfig({ colorPalette: localColorPalette });
  };

  const handleResetPreview = () => {
    resetPreview();
    const hexPalette: any = {};
    Object.entries(config.colorPalette).forEach(([key, value]) => {
      hexPalette[key] = hslToHex(value);
    });
    setLocalColorPalette(hexPalette);
  };

  const togglePreview = () => {
    if (showPreview) {
      resetPreview();
    } else {
      previewConfig({ colorPalette: localColorPalette });
    }
    setShowPreview(!showPreview);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Paleta de Colores Completa
        </CardTitle>
        <CardDescription>
          Personaliza todos los colores de tu sitio web con vista previa en tiempo real
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(colorCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.colors.map(({ key, label, description, usage }) => (
                <ColorPicker
                  key={key}
                  label={label}
                  color={localColorPalette[key as keyof typeof localColorPalette] || '#000000'}
                  onChange={(color) => handleColorChange(key as keyof VisualConfig['colorPalette'], color)}
                  description={description}
                  usage={usage}
                />
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-2">
            {previewMode && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Vista Previa Activa
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
            >
              {showPreview ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Ocultar Vista Previa
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Mostrar Vista Previa
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetPreview}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
            <Button
              onClick={handleSave}
              variant="default"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Colores'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedColorPaletteManager;
