import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, RefreshCw, Eye } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { toast } from 'sonner';

const TestimonialsPageEditor = () => {
  const { config, loading, previewMode, saveConfig, previewConfig, resetPreview } = useVisualConfig();
  const [localColors, setLocalColors] = useState({
    primary: config.colorPalette.primary,
    secondary: config.colorPalette.secondary,
    background: config.colorPalette.background,
    text: config.colorPalette.text,
    accent: config.colorPalette.accent,
    card: config.colorPalette.card,
    muted: config.colorPalette.muted,
    warning: config.colorPalette.warning,
  });

  const handleColorChange = (colorKey: string, newColor: string) => {
    const updatedColors = { ...localColors, [colorKey]: newColor };
    setLocalColors(updatedColors);
    
    // Vista previa en tiempo real
    previewConfig({
      colorPalette: {
        ...config.colorPalette,
        ...updatedColors,
      },
    });
  };

  const handleSave = async () => {
    try {
      await saveConfig({
        colorPalette: {
          ...config.colorPalette,
          ...localColors,
        },
      });
      toast.success('Colores de testimonios guardados');
    } catch (error) {
      toast.error('Error al guardar los colores');
    }
  };

  const handleResetPreview = () => {
    setLocalColors({
      primary: config.colorPalette.primary,
      secondary: config.colorPalette.secondary,
      background: config.colorPalette.background,
      text: config.colorPalette.text,
      accent: config.colorPalette.accent,
      card: config.colorPalette.card,
      muted: config.colorPalette.muted,
      warning: config.colorPalette.warning,
    });
    resetPreview();
  };

  const colorFields = [
    { key: 'primary', label: 'Color Principal', description: 'Color del título y elementos destacados' },
    { key: 'secondary', label: 'Color Secundario', description: 'Color para ratings y valoraciones' },
    { key: 'background', label: 'Fondo', description: 'Color de fondo de la página de testimonios' },
    { key: 'text', label: 'Texto Principal', description: 'Color del texto de los testimonios' },
    { key: 'accent', label: 'Acentos', description: 'Color para elementos interactivos' },
    { key: 'card', label: 'Tarjetas de Testimonios', description: 'Fondo de las tarjetas de testimonios' },
    { key: 'muted', label: 'Texto Secundario', description: 'Color para nombres y fechas' },
    { key: 'warning', label: 'Estrellas', description: 'Color para las estrellas de calificación' },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Testimonios
        </CardTitle>
        <CardDescription>
          Personaliza los colores utilizados en la página de testimonios (reseñas, calificaciones, comentarios)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colorFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
              </Label>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Input
                    id={field.key}
                    type="color"
                    value={localColors[field.key as keyof typeof localColors]}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={localColors[field.key as keyof typeof localColors]}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
              <p className="text-xs text-muted-foreground">{field.description}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          
          {previewMode && (
            <Button 
              onClick={handleResetPreview} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Cancelar Vista Previa
            </Button>
          )}
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            {previewMode ? 'Vista previa activa' : 'Editando en tiempo real'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsPageEditor;