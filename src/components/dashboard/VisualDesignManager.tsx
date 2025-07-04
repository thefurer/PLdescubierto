
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Navigation, Image, MousePointer, Type, Eye } from 'lucide-react';
import EnhancedColorPaletteManager from './visual-design/EnhancedColorPaletteManager';
import EnhancedNavbarManager from './visual-design/EnhancedNavbarManager';
import LogoManager from './visual-design/LogoManager';
import ButtonStylesManager from './visual-design/ButtonStylesManager';
import TypographyManager from './visual-design/TypographyManager';
import VisualPreview from './visual-design/VisualPreview';

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Diseño Visual y Ajustes</h2>
        <p className="text-gray-600">Personaliza la apariencia visual de tu sitio web</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="colors" className="flex items-center gap-1 text-xs">
                <Palette className="h-3 w-3" />
                Colores
              </TabsTrigger>
              <TabsTrigger value="navbar" className="flex items-center gap-1 text-xs">
                <Navigation className="h-3 w-3" />
                Navbar
              </TabsTrigger>
              <TabsTrigger value="buttons" className="flex items-center gap-1 text-xs">
                <MousePointer className="h-3 w-3" />
                Botones
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-1 text-xs">
                <Type className="h-3 w-3" />
                Texto
              </TabsTrigger>
              <TabsTrigger value="logo" className="flex items-center gap-1 text-xs">
                <Image className="h-3 w-3" />
                Logo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors">
              <EnhancedColorPaletteManager />
            </TabsContent>

            <TabsContent value="navbar">
              <EnhancedNavbarManager />
            </TabsContent>

            <TabsContent value="buttons">
              <ButtonStylesManager />
            </TabsContent>

            <TabsContent value="typography">
              <TypographyManager />
            </TabsContent>

            <TabsContent value="logo">
              <LogoManager />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="xl:col-span-1">
          <VisualPreview />
        </div>
      </div>
    </div>
  );
};

export default VisualDesignManager;
