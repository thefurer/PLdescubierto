
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Palette, RefreshCw, Eye, EyeOff, Info, Monitor } from 'lucide-react';
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
        <input
          type="color"
          id={label}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded-md border-gray-200 shadow-sm cursor-pointer"
        />
        <div className="flex-1">
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-1 text-sm border rounded-md font-mono"
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

const ColorPreviewSection = ({ colorPalette }: { colorPalette: VisualConfig['colorPalette'] }) => {
  return (
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Monitor className="h-5 w-5 text-blue-600" />
          Vista Previa de Colores en Tiempo Real
        </CardTitle>
        <CardDescription>
          Observa cómo se aplicarán los colores en tu sitio web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navbar Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Barra de Navegación</Label>
          <div 
            className="h-12 rounded-lg flex items-center px-4 shadow-sm border"
            style={{ 
              backgroundColor: colorPalette.navbar,
              borderColor: colorPalette.border
            }}
          >
            <div className="font-bold" style={{ color: colorPalette.text }}>
              Puerto López
            </div>
            <div className="ml-auto flex space-x-4">
              {['Inicio', 'Atracciones', 'Contacto'].map((item) => (
                <span 
                  key={item}
                  className="text-sm font-medium cursor-pointer hover:opacity-80"
                  style={{ color: colorPalette.link }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Contenido Principal</Label>
          <div 
            className="p-4 rounded-lg shadow-sm border"
            style={{ 
              backgroundColor: colorPalette.background,
              borderColor: colorPalette.border
            }}
          >
            <h3 
              className="text-lg font-bold mb-2"
              style={{ color: colorPalette.text }}
            >
              Título Principal
            </h3>
            <p 
              className="text-sm mb-3"
              style={{ color: colorPalette.muted }}
            >
              Este es un ejemplo de texto secundario que muestra cómo se ve el color muted.
            </p>
            <div className="flex gap-2 mb-3">
              <div 
                className="px-3 py-1 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: colorPalette.primary,
                  color: 'white'
                }}
              >
                Botón Primario
              </div>
              <div 
                className="px-3 py-1 rounded text-xs font-medium border"
                style={{ 
                  backgroundColor: 'transparent',
                  color: colorPalette.secondary,
                  borderColor: colorPalette.secondary
                }}
              >
                Botón Secundario
              </div>
            </div>
            <a 
              href="#" 
              className="text-sm underline hover:opacity-80"
              style={{ color: colorPalette.link }}
            >
              Ejemplo de enlace
            </a>
          </div>
        </div>

        {/* Card Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Tarjetas de Contenido</Label>
          <div 
            className="p-4 rounded-lg shadow-sm border"
            style={{ 
              backgroundColor: colorPalette.card,
              borderColor: colorPalette.border
            }}
          >
            <h4 
              className="font-semibold mb-2"
              style={{ color: colorPalette.text }}
            >
              Tarjeta de Atracción
            </h4>
            <p 
              className="text-sm mb-2"
              style={{ color: colorPalette.muted }}
            >
              Descripción de la atracción turística con información relevante.
            </p>
            <div className="flex justify-between items-center">
              <div 
                className="px-2 py-1 rounded text-xs"
                style={{ 
                  backgroundColor: colorPalette.accent,
                  color: 'white'
                }}
              >
                Destacado
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: colorPalette.primary }}
              >
                Ver más →
              </span>
            </div>
          </div>
        </div>

        {/* Status Colors Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Estados y Retroalimentación</Label>
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="p-2 rounded text-xs font-medium text-center"
              style={{ backgroundColor: colorPalette.success, color: 'white' }}
            >
              Éxito
            </div>
            <div 
              className="p-2 rounded text-xs font-medium text-center"
              style={{ backgroundColor: colorPalette.warning, color: 'white' }}
            >
              Advertencia
            </div>
            <div 
              className="p-2 rounded text-xs font-medium text-center"
              style={{ backgroundColor: colorPalette.destructive, color: 'white' }}
            >
              Error
            </div>
            <div 
              className="p-2 rounded text-xs font-medium text-center"
              style={{ backgroundColor: colorPalette.info, color: 'white' }}
            >
              Información
            </div>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Paleta Completa</Label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(colorPalette).map(([key, color]) => (
              <div key={key} className="text-center">
                <div
                  className="w-full h-8 rounded-md border shadow-sm"
                  style={{ backgroundColor: color }}
                  title={`${key}: ${color}`}
                />
                <span className="text-xs text-gray-600 capitalize mt-1 block">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
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
  const { config, saveConfig, previewConfig, resetPreview, loading, previewMode } = useVisualConfig();
  const [localColorPalette, setLocalColorPalette] = useState(config.colorPalette);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    setLocalColorPalette(config.colorPalette);
  }, [config.colorPalette]);

  const handleColorChange = (key: keyof VisualConfig['colorPalette'], newColor: string) => {
    const updatedPalette = { ...localColorPalette, [key]: newColor };
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
    setLocalColorPalette(config.colorPalette);
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
    <div className="space-y-6">
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
        <CardContent>
          {/* Vista Previa Prominente */}
          <ColorPreviewSection colorPalette={localColorPalette} />
          
          {/* Controles de Colores */}
          <div className="space-y-6">
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
                      color={localColorPalette[key as keyof typeof localColorPalette]}
                      onChange={(color) => handleColorChange(key as keyof VisualConfig['colorPalette'], color)}
                      description={description}
                      usage={usage}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

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
    </div>
  );
};

export default EnhancedColorPaletteManager;
