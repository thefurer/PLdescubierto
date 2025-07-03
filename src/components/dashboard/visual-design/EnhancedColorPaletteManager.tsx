import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Eye, Palette, RefreshCw } from 'lucide-react';
import { useVisualConfig, VisualConfig } from '@/hooks/useVisualConfig';

const predefinedPalettes = [
  {
    name: 'Puerto López Original',
    colors: {
      primary: '#2563eb',
      secondary: '#10b981',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#f59e0b',
      navbar: '#ffffff',
      button: '#2563eb',
      link: '#2563eb',
    }
  },
  {
    name: 'Océano Tropical',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      background: '#f0fdf4',
      text: '#064e3b',
      accent: '#f97316',
      navbar: '#ecfccb',
      button: '#0ea5e9',
      link: '#0891b2',
    }
  },
  {
    name: 'Atardecer Playero',
    colors: {
      primary: '#f97316',
      secondary: '#eab308',
      background: '#fefce8',
      text: '#92400e',
      accent: '#dc2626',
      navbar: '#fed7aa',
      button: '#f97316',
      link: '#ea580c',
    }
  },
  {
    name: 'Selva Verde',
    colors: {
      primary: '#059669',
      secondary: '#65a30d',
      background: '#f7fee7',
      text: '#14532d',
      accent: '#dc2626',
      navbar: '#dcfce7',
      button: '#059669',
      link: '#047857',
    }
  }
];

const EnhancedColorPaletteManager = () => {
  const { config, saveConfig, previewConfig, resetPreview, previewMode, loading } = useVisualConfig();
  const [localPalette, setLocalPalette] = useState(config.colorPalette);
  const [realTimePreview, setRealTimePreview] = useState(true);

  const handleColorChange = (colorKey: keyof typeof localPalette, value: string) => {
    const newPalette = { ...localPalette, [colorKey]: value };
    setLocalPalette(newPalette);
    
    if (realTimePreview) {
      previewConfig({ colorPalette: newPalette });
    }
  };

  const applyPredefinedPalette = (palette: typeof predefinedPalettes[0]) => {
    setLocalPalette(palette.colors);
    if (realTimePreview) {
      previewConfig({ colorPalette: palette.colors });
    }
  };

  const handleSave = async () => {
    await saveConfig({ colorPalette: localPalette });
    resetPreview();
  };

  const handleReset = () => {
    setLocalPalette(config.colorPalette);
    resetPreview();
  };

  const colorFields = [
    { key: 'primary' as const, label: 'Color Primario', description: 'Color principal del sitio' },
    { key: 'secondary' as const, label: 'Color Secundario', description: 'Color de apoyo' },
    { key: 'accent' as const, label: 'Color de Acento', description: 'Para destacar elementos' },
    { key: 'navbar' as const, label: 'Fondo del Navbar', description: 'Color de fondo de navegación' },
    { key: 'button' as const, label: 'Botones Principales', description: 'Color de botones primarios' },
    { key: 'link' as const, label: 'Enlaces', description: 'Color de enlaces de texto' },
    { key: 'background' as const, label: 'Fondo Principal', description: 'Color de fondo general' },
    { key: 'text' as const, label: 'Texto Principal', description: 'Color de texto principal' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Paleta de Colores Avanzada
              </CardTitle>
              <CardDescription>
                Personaliza todos los colores de tu sitio web con previsualización en tiempo real
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={realTimePreview}
                onCheckedChange={setRealTimePreview}
                id="real-time-preview"
              />
              <Label htmlFor="real-time-preview" className="text-sm">
                Vista previa en tiempo real
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Paletas predefinidas */}
          <div>
            <h4 className="text-sm font-medium mb-3">Paletas Predefinidas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedPalettes.map((palette) => (
                <Button
                  key={palette.name}
                  variant="outline"
                  className="h-auto p-3 justify-start"
                  onClick={() => applyPredefinedPalette(palette)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex gap-1">
                      {Object.values(palette.colors).slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm">{palette.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Editor de colores */}
          <div>
            <h4 className="text-sm font-medium mb-4">Colores Personalizados</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-sm font-medium">
                    {field.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                  <div className="flex gap-2">
                    <div
                      className="w-12 h-10 rounded border border-input cursor-pointer"
                      style={{ backgroundColor: localPalette[field.key] }}
                      onClick={() => {
                        const input = document.getElementById(`${field.key}-color`) as HTMLInputElement;
                        input?.click();
                      }}
                    />
                    <Input
                      id={`${field.key}-color`}
                      type="color"
                      value={localPalette[field.key]}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      className="sr-only"
                    />
                    <Input
                      value={localPalette[field.key]}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      className="flex-1 font-mono text-sm"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview y controles */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {previewMode && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Modo Vista Previa
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Restablecer
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedColorPaletteManager;