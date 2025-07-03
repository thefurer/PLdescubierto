import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Eye, Palette } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';

const fontOptions = [
  { name: 'Poppins', value: 'Poppins', preview: 'Aa Bb Cc' },
  { name: 'Inter', value: 'Inter', preview: 'Aa Bb Cc' },
  { name: 'Roboto', value: 'Roboto', preview: 'Aa Bb Cc' },
  { name: 'Open Sans', value: 'Open Sans', preview: 'Aa Bb Cc' },
  { name: 'Lato', value: 'Lato', preview: 'Aa Bb Cc' },
  { name: 'Montserrat', value: 'Montserrat', preview: 'Aa Bb Cc' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro', preview: 'Aa Bb Cc' },
  { name: 'Nunito', value: 'Nunito', preview: 'Aa Bb Cc' },
];

const TypographyManager = () => {
  const { config, saveConfig, previewConfig, resetPreview, previewMode, loading } = useVisualConfig();
  const [localTypography, setLocalTypography] = useState(config.typography);
  const [realTimePreview, setRealTimePreview] = useState(true);

  const handleTypographyChange = (updates: Partial<typeof localTypography>) => {
    const newTypography = { ...localTypography, ...updates };
    setLocalTypography(newTypography);
    
    if (realTimePreview) {
      previewConfig({ typography: newTypography });
    }
  };

  const handleSave = async () => {
    await saveConfig({ typography: localTypography });
    resetPreview();
  };

  const handleReset = () => {
    setLocalTypography(config.typography);
    resetPreview();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Tipografía y Texto
            </CardTitle>
            <CardDescription>
              Personaliza las fuentes y colores de texto del sitio
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={realTimePreview}
              onCheckedChange={setRealTimePreview}
              id="typography-real-time-preview"
            />
            <Label htmlFor="typography-real-time-preview" className="text-sm">
              Vista previa en tiempo real
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selección de fuente */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Familia de Fuente</Label>
          <Select
            value={localTypography.fontFamily}
            onValueChange={(value) => handleTypographyChange({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <div className="flex items-center justify-between w-full">
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                    <span className="text-muted-foreground ml-4" style={{ fontFamily: font.value }}>
                      {font.preview}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Colores de texto */}
        <div>
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colores de Texto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="heading-color">Títulos y Encabezados</Label>
              <div className="flex gap-2 mt-2">
                <div
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                  style={{ backgroundColor: localTypography.headingColor }}
                  onClick={() => {
                    const input = document.getElementById('heading-color-picker') as HTMLInputElement;
                    input?.click();
                  }}
                />
                <Input
                  id="heading-color-picker"
                  type="color"
                  value={localTypography.headingColor}
                  onChange={(e) => handleTypographyChange({ headingColor: e.target.value })}
                  className="sr-only"
                />
                <Input
                  value={localTypography.headingColor}
                  onChange={(e) => handleTypographyChange({ headingColor: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="body-color">Texto de Cuerpo</Label>
              <div className="flex gap-2 mt-2">
                <div
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                  style={{ backgroundColor: localTypography.bodyColor }}
                  onClick={() => {
                    const input = document.getElementById('body-color-picker') as HTMLInputElement;
                    input?.click();
                  }}
                />
                <Input
                  id="body-color-picker"
                  type="color"
                  value={localTypography.bodyColor}
                  onChange={(e) => handleTypographyChange({ bodyColor: e.target.value })}
                  className="sr-only"
                />
                <Input
                  value={localTypography.bodyColor}
                  onChange={(e) => handleTypographyChange({ bodyColor: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="link-color">Enlaces</Label>
              <div className="flex gap-2 mt-2">
                <div
                  className="w-12 h-10 rounded border border-input cursor-pointer"
                  style={{ backgroundColor: localTypography.linkColor }}
                  onClick={() => {
                    const input = document.getElementById('link-color-picker') as HTMLInputElement;
                    input?.click();
                  }}
                />
                <Input
                  id="link-color-picker"
                  type="color"
                  value={localTypography.linkColor}
                  onChange={(e) => handleTypographyChange({ linkColor: e.target.value })}
                  className="sr-only"
                />
                <Input
                  value={localTypography.linkColor}
                  onChange={(e) => handleTypographyChange({ linkColor: e.target.value })}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vista previa de tipografía */}
        <div>
          <Label className="text-sm font-medium mb-4 block flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vista Previa de Tipografía
          </Label>
          <div className="border rounded-lg p-6 bg-muted/50 space-y-4">
            <div style={{ fontFamily: localTypography.fontFamily }}>
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: localTypography.headingColor }}
              >
                Título Principal (H1)
              </h1>
              <h2 
                className="text-2xl font-semibold mb-2"
                style={{ color: localTypography.headingColor }}
              >
                Subtítulo Secundario (H2)
              </h2>
              <h3 
                className="text-xl font-medium mb-4"
                style={{ color: localTypography.headingColor }}
              >
                Encabezado Terciario (H3)
              </h3>
              <p 
                className="text-base mb-3 leading-relaxed"
                style={{ color: localTypography.bodyColor }}
              >
                Este es un párrafo de ejemplo que muestra cómo se verá el texto de cuerpo en tu sitio web. 
                Puerto López es un destino increíble con hermosas playas y una rica biodiversidad marina.
              </p>
              <p 
                className="text-sm mb-3"
                style={{ color: localTypography.bodyColor }}
              >
                Texto más pequeño para descripciones y detalles adicionales. 
                <a 
                  href="#" 
                  className="underline hover:no-underline"
                  style={{ color: localTypography.linkColor }}
                >
                  Este es un enlace de ejemplo
                </a> que puedes personalizar.
              </p>
              <div className="flex gap-4 text-sm">
                <a 
                  href="#" 
                  className="hover:underline"
                  style={{ color: localTypography.linkColor }}
                >
                  Explorar Atracciones
                </a>
                <a 
                  href="#" 
                  className="hover:underline"
                  style={{ color: localTypography.linkColor }}
                >
                  Ver Galería
                </a>
                <a 
                  href="#" 
                  className="hover:underline"
                  style={{ color: localTypography.linkColor }}
                >
                  Contactar
                </a>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                <strong>Fuente actual:</strong> {localTypography.fontFamily}
              </div>
            </div>
          </div>
        </div>

        {/* Controles de guardado */}
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
            >
              Restablecer
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Guardar Tipografía
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypographyManager;