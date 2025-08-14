import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw, Eye, Home, MapPin, Image as ImageIcon, Zap, MessageCircle } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { toast } from 'sonner';

const HomePageEditor = () => {
  const { config, loading, previewMode, isInitialized, saveConfig, previewConfig, resetPreview } = useVisualConfig();
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

  const [localColors, setLocalColors] = useState({
    // Hero Section
    heroPrimary: hslToHex(config.colorPalette.primary),
    heroSecondary: hslToHex(config.colorPalette.secondary),
    heroBackground: hslToHex(config.colorPalette.background),
    heroText: hslToHex(config.colorPalette.text),
    heroAccent: hslToHex(config.colorPalette.accent),
    
    // Attractions Section
    attractionsPrimary: hslToHex(config.colorPalette.primary),
    attractionsCard: hslToHex(config.colorPalette.card),
    attractionsText: hslToHex(config.colorPalette.text),
    attractionsBorder: hslToHex(config.colorPalette.border),
    
    // Activities Section
    activitiesSecondary: hslToHex(config.colorPalette.secondary),
    activitiesAccent: hslToHex(config.colorPalette.accent),
    activitiesBackground: hslToHex(config.colorPalette.background),
    
    // Gallery Section
    galleryCard: hslToHex(config.colorPalette.card),
    galleryText: hslToHex(config.colorPalette.text),
    galleryMuted: hslToHex(config.colorPalette.muted),
    
    // Metaverse Section
    metaversePrimary: '#6366f1', // indigo-500
    metaverseSecondary: '#8b5cf6', // violet-500  
    metaverseAccent: '#ec4899', // pink-500
    metaverseBackground: '#1e1b4b', // indigo-900
    metaverseText: '#ffffff',
    
    // Contact Section
    contactPrimary: hslToHex(config.colorPalette.primary),
    contactBackground: hslToHex(config.colorPalette.card),
    contactText: hslToHex(config.colorPalette.text),
  });

  // Sync local colors with config when it changes
  useEffect(() => {
    if (isInitialized) {
      setLocalColors({
        heroPrimary: hslToHex(config.colorPalette.primary),
        heroSecondary: hslToHex(config.colorPalette.secondary),
        heroBackground: hslToHex(config.colorPalette.background),
        heroText: hslToHex(config.colorPalette.text),
        heroAccent: hslToHex(config.colorPalette.accent),
        attractionsPrimary: hslToHex(config.colorPalette.primary),
        attractionsCard: hslToHex(config.colorPalette.card),
        attractionsText: hslToHex(config.colorPalette.text),
        attractionsBorder: hslToHex(config.colorPalette.border),
        activitiesSecondary: hslToHex(config.colorPalette.secondary),
        activitiesAccent: hslToHex(config.colorPalette.accent),
        activitiesBackground: hslToHex(config.colorPalette.background),
        galleryCard: hslToHex(config.colorPalette.card),
        galleryText: hslToHex(config.colorPalette.text),
        galleryMuted: hslToHex(config.colorPalette.muted),
        metaversePrimary: '#6366f1',
        metaverseSecondary: '#8b5cf6',
        metaverseAccent: '#ec4899',
        metaverseBackground: '#1e1b4b',
        metaverseText: '#ffffff',
        contactPrimary: hslToHex(config.colorPalette.primary),
        contactBackground: hslToHex(config.colorPalette.card),
        contactText: hslToHex(config.colorPalette.text),
      });
    }
  }, [config, isInitialized]);

  const handleColorChange = (colorKey: string, newColor: string) => {
    const updatedColors = { ...localColors, [colorKey]: newColor };
    setLocalColors(updatedColors);
    
    // Map section colors to main color palette for real-time preview
    const mappedColors = {
      primary: updatedColors.heroPrimary || config.colorPalette.primary,
      secondary: updatedColors.heroSecondary || config.colorPalette.secondary,
      background: updatedColors.heroBackground || config.colorPalette.background,
      text: updatedColors.heroText || config.colorPalette.text,
      accent: updatedColors.heroAccent || config.colorPalette.accent,
      card: updatedColors.attractionsCard || config.colorPalette.card,
      border: updatedColors.attractionsBorder || config.colorPalette.border,
      muted: updatedColors.galleryMuted || config.colorPalette.muted,
      navbar: updatedColors.heroPrimary || config.colorPalette.navbar,
      button: updatedColors.heroAccent || config.colorPalette.button,
      link: updatedColors.heroPrimary || config.colorPalette.link,
      destructive: config.colorPalette.destructive,
      warning: config.colorPalette.warning,
      success: config.colorPalette.success,
      info: config.colorPalette.info,
    };
    
    // Vista previa en tiempo real
    previewConfig({
      colorPalette: mappedColors,
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
          navbar: localColors.heroPrimary,
          button: localColors.heroAccent,
          link: localColors.heroPrimary,
        },
      });
      toast.success('Colores de la página principal guardados');
    } catch (error) {
      toast.error('Error al guardar los colores');
    }
  };

  const handleResetPreview = () => {
    setLocalColors({
      heroPrimary: config.colorPalette.primary,
      heroSecondary: config.colorPalette.secondary,
      heroBackground: config.colorPalette.background,
      heroText: config.colorPalette.text,
      heroAccent: config.colorPalette.accent,
      attractionsPrimary: config.colorPalette.primary,
      attractionsCard: config.colorPalette.card,
      attractionsText: config.colorPalette.text,
      attractionsBorder: config.colorPalette.border,
      activitiesSecondary: config.colorPalette.secondary,
      activitiesAccent: config.colorPalette.accent,
      activitiesBackground: config.colorPalette.background,
      galleryCard: config.colorPalette.card,
      galleryText: config.colorPalette.text,
      galleryMuted: config.colorPalette.muted,
      metaversePrimary: '#6366f1',
      metaverseSecondary: '#8b5cf6',
      metaverseAccent: '#ec4899',
      metaverseBackground: '#1e1b4b',
      metaverseText: '#ffffff',
      contactPrimary: config.colorPalette.primary,
      contactBackground: config.colorPalette.card,
      contactText: config.colorPalette.text,
    });
    resetPreview();
  };

  const sectionConfigs = {
    hero: {
      title: 'Sección Hero',
      icon: Home,
      color: 'bg-blue-500',
      fields: [
        { key: 'heroPrimary', label: 'Color Principal', description: 'Título principal y elementos destacados' },
        { key: 'heroSecondary', label: 'Color Secundario', description: 'Subtítulos y elementos secundarios' },
        { key: 'heroBackground', label: 'Fondo', description: 'Color de fondo del hero' },
        { key: 'heroText', label: 'Texto', description: 'Color del texto principal' },
        { key: 'heroAccent', label: 'Acentos', description: 'Botones y elementos de call-to-action' },
      ]
    },
    attractions: {
      title: 'Sección Atracciones',
      icon: MapPin,
      color: 'bg-green-500',
      fields: [
        { key: 'attractionsPrimary', label: 'Color Principal', description: 'Títulos de atracciones' },
        { key: 'attractionsCard', label: 'Tarjetas', description: 'Fondo de tarjetas de atracciones' },
        { key: 'attractionsText', label: 'Texto', description: 'Descripciones y contenido' },
        { key: 'attractionsBorder', label: 'Bordes', description: 'Bordes de tarjetas y elementos' },
      ]
    },
    activities: {
      title: 'Sección Actividades',
      icon: Zap,
      color: 'bg-purple-500',
      fields: [
        { key: 'activitiesSecondary', label: 'Color Principal', description: 'Títulos de actividades' },
        { key: 'activitiesAccent', label: 'Acentos', description: 'Elementos destacados' },
        { key: 'activitiesBackground', label: 'Fondo', description: 'Fondo de la sección' },
      ]
    },
    gallery: {
      title: 'Sección Galería',
      icon: ImageIcon,
      color: 'bg-pink-500',
      fields: [
        { key: 'galleryCard', label: 'Tarjetas', description: 'Fondo de contenedores de imágenes' },
        { key: 'galleryText', label: 'Texto', description: 'Títulos y descripciones' },
        { key: 'galleryMuted', label: 'Texto Secundario', description: 'Metadatos y texto auxiliar' },
      ]
    },
    metaverse: {
      title: 'Sección Metaverso',
      icon: Zap,
      color: 'bg-indigo-500',
      fields: [
        { key: 'metaversePrimary', label: 'Color Principal', description: 'Gradiente principal (indigo)' },
        { key: 'metaverseSecondary', label: 'Color Secundario', description: 'Gradiente secundario (violeta)' },
        { key: 'metaverseAccent', label: 'Acentos', description: 'Gradiente de acento (rosa)' },
        { key: 'metaverseBackground', label: 'Fondo', description: 'Fondo base de la sección' },
        { key: 'metaverseText', label: 'Texto', description: 'Color del texto sobre fondo oscuro' },
      ]
    },
    contact: {
      title: 'Sección Contacto',
      icon: MessageCircle,
      color: 'bg-orange-500',
      fields: [
        { key: 'contactPrimary', label: 'Color Principal', description: 'Títulos y elementos principales' },
        { key: 'contactBackground', label: 'Fondo', description: 'Fondo de formularios' },
        { key: 'contactText', label: 'Texto', description: 'Color del texto del formulario' },
      ]
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Página Principal
        </CardTitle>
        <CardDescription>
          Personaliza los colores específicos utilizados en la página principal (hero, atracciones, actividades, galería)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50">
            {Object.entries(sectionConfigs).map(([key, config]) => {
              const IconComponent = config.icon;
              return (
                <TabsTrigger 
                  key={key}
                  value={key} 
                  className="flex items-center gap-2 text-xs"
                >
                  <IconComponent className="h-3 w-3" />
                  <span className="hidden sm:inline">{config.title.split(' ')[1]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(sectionConfigs).map(([sectionKey, sectionConfig]) => (
            <TabsContent key={sectionKey} value={sectionKey} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 ${sectionConfig.color} rounded-full`}></div>
                <h3 className="text-lg font-semibold">{sectionConfig.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectionConfig.fields.map((field) => (
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
            </TabsContent>
          ))}
        </Tabs>

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

export default HomePageEditor;