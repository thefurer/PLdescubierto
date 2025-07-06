import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Palette, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { VisualConfig } from '@/types/visualConfig';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (newColor: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={label} className="text-sm font-medium">
        {label}
      </Label>
      <input
        type="color"
        id={label}
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 rounded-md border-gray-200 shadow-sm"
      />
    </div>
  );
};

const EnhancedColorPaletteManager = () => {
  const { config, saveConfig, previewConfig, resetPreview, loading } = useVisualConfig();
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Paleta de Colores
        </CardTitle>
        <CardDescription>
          Ajusta los colores de tu sitio web
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Primario"
            color={localColorPalette.primary}
            onChange={(color) => handleColorChange('primary', color)}
          />
          <ColorPicker
            label="Secundario"
            color={localColorPalette.secondary}
            onChange={(color) => handleColorChange('secondary', color)}
          />
          <ColorPicker
            label="Fondo"
            color={localColorPalette.background}
            onChange={(color) => handleColorChange('background', color)}
          />
          <ColorPicker
            label="Texto"
            color={localColorPalette.text}
            onChange={(color) => handleColorChange('text', color)}
          />
          <ColorPicker
            label="Acento"
            color={localColorPalette.accent}
            onChange={(color) => handleColorChange('accent', color)}
          />
        </div>
        <div className="flex justify-between items-center">
          <Button
            onClick={handleSave}
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Colores'}
          </Button>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedColorPaletteManager;
