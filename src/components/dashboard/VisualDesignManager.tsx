
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Navigation, Image, MousePointer, Type, Eye } from 'lucide-react';
import EnhancedColorPaletteManager from './visual-design/EnhancedColorPaletteManager';
import EnhancedNavbarManager from './visual-design/EnhancedNavbarManager';
import LogoManager from './visual-design/LogoManager';
import ButtonStylesManager from './visual-design/ButtonStylesManager';
import TypographyManager from './visual-design/TypographyManager';
import VisualPreview from './visual-design/VisualPreview';

const VisualDesignManager = () => {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Diseño Visual y Ajustes
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Personaliza la apariencia visual de tu sitio web con vista previa en tiempo real
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
        {/* Vista Previa - Columna fija a la izquierda en pantallas grandes */}
        <div className="2xl:col-span-5 order-2 2xl:order-1">
          <div className="sticky top-6">
            <VisualPreview />
          </div>
        </div>
        
        {/* Configuraciones - Columna principal */}
        <div className="2xl:col-span-7 order-1 2xl:order-2">
          <Tabs defaultValue="colors" className="space-y-6">
            <div className="bg-white rounded-xl p-1 shadow-sm border">
              <TabsList className="grid w-full grid-cols-5 bg-transparent gap-1">
                <TabsTrigger 
                  value="colors" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-200"
                >
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Colores</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="navbar" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all duration-200"
                >
                  <Navigation className="h-4 w-4" />
                  <span className="hidden sm:inline">Navbar</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="buttons" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all duration-200"
                >
                  <MousePointer className="h-4 w-4" />
                  <span className="hidden sm:inline">Botones</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="typography" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all duration-200"
                >
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">Texto</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="logo" 
                  className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-all duration-200"
                >
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Logo</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="min-h-[600px]">
              <TabsContent value="colors" className="mt-6">
                <EnhancedColorPaletteManager />
              </TabsContent>

              <TabsContent value="navbar" className="mt-6">
                <EnhancedNavbarManager />
              </TabsContent>

              <TabsContent value="buttons" className="mt-6">
                <ButtonStylesManager />
              </TabsContent>

              <TabsContent value="typography" className="mt-6">
                <TypographyManager />
              </TabsContent>

              <TabsContent value="logo" className="mt-6">
                <LogoManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VisualDesignManager;
