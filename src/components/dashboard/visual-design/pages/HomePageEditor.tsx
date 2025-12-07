import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, RefreshCw, Home, MapPin, Image as ImageIcon, Zap, MessageCircle } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { toast } from 'sonner';

const HomePageEditor = () => {
  const { config, loading, previewMode, isInitialized, saveConfig, previewConfig, resetPreview } = useVisualConfig();
  
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

  const [localColors, setLocalColors] = useState({
    heroPrimary: hslToHex(config.colorPalette.primary),
    heroSecondary: hslToHex(config.colorPalette.secondary),
    heroBackground: hslToHex(config.colorPalette.background),
    heroText: hslToHex(config.colorPalette.text),
    heroAccent: hslToHex(config.colorPalette.accent),
    attractionsCard: hslToHex(config.colorPalette.card),
    attractionsBorder: hslToHex(config.colorPalette.border),
    galleryMuted: hslToHex(config.colorPalette.muted),
  });

  useEffect(() => {
    if (isInitialized) {
      setLocalColors({
        heroPrimary: hslToHex(config.colorPalette.primary),
        heroSecondary: hslToHex(config.colorPalette.secondary),
        heroBackground: hslToHex(config.colorPalette.background),
        heroText: hslToHex(config.colorPalette.text),
        heroAccent: hslToHex(config.colorPalette.accent),
        attractionsCard: hslToHex(config.colorPalette.card),
        attractionsBorder: hslToHex(config.colorPalette.border),
        galleryMuted: hslToHex(config.colorPalette.muted),
      });
    }
  }, [config, isInitialized]);

  const handleColorChange = (colorKey: string, newColor: string) => {
    const updatedColors = { ...localColors, [colorKey]: newColor };
    setLocalColors(updatedColors);
    
    previewConfig({
      colorPalette: {
        primary: updatedColors.heroPrimary,
        secondary: updatedColors.heroSecondary,
        background: updatedColors.heroBackground,
        text: updatedColors.heroText,
        accent: updatedColors.heroAccent,
        card: updatedColors.attractionsCard,
        border: updatedColors.attractionsBorder,
        muted: updatedColors.galleryMuted,
        navbar: updatedColors.heroPrimary,
        button: updatedColors.heroAccent,
        link: updatedColors.heroPrimary,
        destructive: config.colorPalette.destructive,
        warning: config.colorPalette.warning,
        success: config.colorPalette.success,
        info: config.colorPalette.info,
      },
    });
  };

  const handleSave = async () => {
    try {
      await saveConfig({
        colorPalette: {
          ...config.colorPalette,
          primary: localColors.heroPrimary,
          secondary: localColors.heroSecondary,
          background: localColors.heroBackground,
          text: localColors.heroText,
          accent: localColors.heroAccent,
          card: localColors.attractionsCard,
          border: localColors.attractionsBorder,
          muted: localColors.galleryMuted,
        },
      });
      toast.success('Colores guardados correctamente');
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleReset = () => {
    setLocalColors({
      heroPrimary: hslToHex(config.colorPalette.primary),
      heroSecondary: hslToHex(config.colorPalette.secondary),
      heroBackground: hslToHex(config.colorPalette.background),
      heroText: hslToHex(config.colorPalette.text),
      heroAccent: hslToHex(config.colorPalette.accent),
      attractionsCard: hslToHex(config.colorPalette.card),
      attractionsBorder: hslToHex(config.colorPalette.border),
      galleryMuted: hslToHex(config.colorPalette.muted),
    });
    resetPreview();
  };

  const sections = [
    {
      id: 'hero',
      title: 'Hero',
      icon: Home,
      fields: [
        { key: 'heroPrimary', label: 'Color Principal' },
        { key: 'heroSecondary', label: 'Color Secundario' },
        { key: 'heroBackground', label: 'Fondo' },
        { key: 'heroText', label: 'Texto' },
        { key: 'heroAccent', label: 'Acentos' },
      ]
    },
    {
      id: 'content',
      title: 'Contenido',
      icon: MapPin,
      fields: [
        { key: 'attractionsCard', label: 'Tarjetas' },
        { key: 'attractionsBorder', label: 'Bordes' },
        { key: 'galleryMuted', label: 'Texto Secundario' },
      ]
    },
  ];

  const ColorInput = ({ colorKey, label }: { colorKey: string; label: string }) => (
    <div className="flex items-center gap-3">
      <Input
        type="color"
        value={localColors[colorKey as keyof typeof localColors]}
        onChange={(e) => handleColorChange(colorKey, e.target.value)}
        className="w-12 h-9 p-1 cursor-pointer"
      />
      <div className="flex-1">
        <Label className="text-sm">{label}</Label>
        <Input
          type="text"
          value={localColors[colorKey as keyof typeof localColors]}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="h-8 font-mono text-xs mt-1"
        />
      </div>
    </div>
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Home className="h-5 w-5 text-blue-500" />
          Página Principal
        </CardTitle>
        <CardDescription className="text-sm">
          Colores de las secciones principales del sitio
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible defaultValue="hero" className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.fields.map((field) => (
                      <ColorInput key={field.key} colorKey={field.key} label={field.label} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSave} disabled={loading} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          {previewMode && (
            <Button onClick={handleReset} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomePageEditor;
