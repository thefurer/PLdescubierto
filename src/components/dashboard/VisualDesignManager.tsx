
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Navigation, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ColorPaletteManager from './visual-design/ColorPaletteManager';
import NavbarManager from './visual-design/NavbarManager';
import LogoManager from './visual-design/LogoManager';

interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

interface NavbarItem {
  name: string;
  url: string;
  visible: boolean;
  order: number;
}

interface LogoSettings {
  position: 'left' | 'center' | 'right';
  size: 'standard';
  height: number;
  margin: string;
}

const VisualDesignManager = () => {
  const [loading, setLoading] = useState(false);
  const [colorPalette, setColorPalette] = useState<ColorPalette>({
    primary: '#2563eb',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b'
  });
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    position: 'left',
    size: 'standard',
    height: 40,
    margin: 'auto'
  });

  useEffect(() => {
    loadVisualConfigurations();
  }, []);

  const loadVisualConfigurations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_visual_config')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      data?.forEach(config => {
        if (config.config_type === 'color_palette') {
          setColorPalette(config.config_data as unknown as ColorPalette);
        } else if (config.config_type === 'navbar_settings') {
          const navbarData = config.config_data as { items?: NavbarItem[] };
          setNavbarItems(navbarData.items || []);
        } else if (config.config_type === 'logo_settings') {
          setLogoSettings(config.config_data as unknown as LogoSettings);
        }
      });
    } catch (error) {
      console.error('Error loading visual configurations:', error);
      toast.error('Error al cargar configuraciones visuales');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuraciones visuales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Diseño Visual y Ajustes</h2>
        <p className="text-gray-600">Personaliza la apariencia visual de tu sitio web</p>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colores
          </TabsTrigger>
          <TabsTrigger value="navbar" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Navegación
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Logo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <ColorPaletteManager
            colorPalette={colorPalette}
            setColorPalette={setColorPalette}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>

        <TabsContent value="navbar">
          <NavbarManager
            navbarItems={navbarItems}
            setNavbarItems={setNavbarItems}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>

        <TabsContent value="logo">
          <LogoManager
            logoSettings={logoSettings}
            setLogoSettings={setLogoSettings}
            loading={loading}
            setLoading={setLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualDesignManager;
