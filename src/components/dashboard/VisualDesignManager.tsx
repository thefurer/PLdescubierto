import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Home, Map, FileText, Star, Navigation, MousePointer, Type, Image } from 'lucide-react';
import HomePageEditor from './visual-design/pages/HomePageEditor';
import TravelGuidePageEditor from './visual-design/pages/TravelGuidePageEditor';
import BlogPageEditor from './visual-design/pages/BlogPageEditor';
import TestimonialsPageEditor from './visual-design/pages/TestimonialsPageEditor';
import EnhancedNavbarManager from './visual-design/EnhancedNavbarManager';
import LogoManager from './visual-design/LogoManager';
import ButtonStylesManager from './visual-design/ButtonStylesManager';
import TypographyManager from './visual-design/TypographyManager';
import EnhancedColorPaletteManager from './visual-design/EnhancedColorPaletteManager';
import VisualPreview from './visual-design/VisualPreview';

const sections = [
  { id: 'home', label: 'Página Principal', icon: Home, component: HomePageEditor },
  { id: 'travel-guide', label: 'Guía de Viaje', icon: Map, component: TravelGuidePageEditor },
  { id: 'blog', label: 'Blog', icon: FileText, component: BlogPageEditor },
  { id: 'testimonials', label: 'Testimonios', icon: Star, component: TestimonialsPageEditor },
  { id: 'navbar', label: 'Navegación', icon: Navigation, component: EnhancedNavbarManager },
  { id: 'buttons', label: 'Botones', icon: MousePointer, component: ButtonStylesManager },
  { id: 'typography', label: 'Tipografía', icon: Type, component: TypographyManager },
  { id: 'logo', label: 'Logo', icon: Image, component: LogoManager },
  { id: 'colors', label: 'Paleta de Colores', icon: Palette, component: EnhancedColorPaletteManager },
];

const VisualDesignManager = () => {
  const [activeSection, setActiveSection] = useState('home');
  
  const currentSection = sections.find(s => s.id === activeSection);
  const ActiveComponent = currentSection?.component || HomePageEditor;
  const ActiveIcon = currentSection?.icon || Home;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Diseño Visual
                </CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  Personaliza la apariencia de tu sitio
                </CardDescription>
              </div>
            </div>
            
            {/* Unified Section Selector */}
            <Select value={activeSection} onValueChange={setActiveSection}>
              <SelectTrigger className="w-[220px] bg-white">
                <div className="flex items-center gap-2">
                  <ActiveIcon className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Selecciona sección" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Páginas</div>
                {sections.slice(0, 4).map((section) => {
                  const Icon = section.icon;
                  return (
                    <SelectItem key={section.id} value={section.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </div>
                    </SelectItem>
                  );
                })}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Estilos</div>
                {sections.slice(4, 7).map((section) => {
                  const Icon = section.icon;
                  return (
                    <SelectItem key={section.id} value={section.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </div>
                    </SelectItem>
                  );
                })}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">Marca</div>
                {sections.slice(7).map((section) => {
                  const Icon = section.icon;
                  return (
                    <SelectItem key={section.id} value={section.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
        {/* Vista Previa */}
        <div className="2xl:col-span-5 order-2 2xl:order-1">
          <div className="sticky top-6">
            <VisualPreview />
          </div>
        </div>
        
        {/* Editor de la sección activa */}
        <div className="2xl:col-span-7 order-1 2xl:order-2">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default VisualDesignManager;
