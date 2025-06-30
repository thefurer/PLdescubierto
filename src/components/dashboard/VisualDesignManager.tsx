import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Navigation, Image, Plus, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';

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
  const { user } = useAuth();
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
  const [newNavItem, setNewNavItem] = useState({ name: '', url: '' });

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
          setColorPalette(config.config_data as ColorPalette);
        } else if (config.config_type === 'navbar_settings') {
          setNavbarItems(config.config_data.items || []);
        } else if (config.config_type === 'logo_settings') {
          setLogoSettings(config.config_data as LogoSettings);
        }
      });
    } catch (error) {
      console.error('Error loading visual configurations:', error);
      toast.error('Error al cargar configuraciones visuales');
    } finally {
      setLoading(false);
    }
  };

  const saveColorPalette = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_visual_config')
        .upsert({
          config_type: 'color_palette',
          config_data: colorPalette,
          is_active: true,
          updated_by: user?.id
        }, {
          onConflict: 'config_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
      toast.success('Paleta de colores guardada exitosamente');
    } catch (error) {
      console.error('Error saving color palette:', error);
      toast.error('Error al guardar la paleta de colores');
    } finally {
      setLoading(false);
    }
  };

  const saveNavbarSettings = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_visual_config')
        .upsert({
          config_type: 'navbar_settings',
          config_data: { items: navbarItems },
          is_active: true,
          updated_by: user?.id
        }, {
          onConflict: 'config_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
      toast.success('Configuración del navbar guardada exitosamente');
    } catch (error) {
      console.error('Error saving navbar settings:', error);
      toast.error('Error al guardar la configuración del navbar');
    } finally {
      setLoading(false);
    }
  };

  const saveLogoSettings = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_visual_config')
        .upsert({
          config_type: 'logo_settings',
          config_data: logoSettings,
          is_active: true,
          updated_by: user?.id
        }, {
          onConflict: 'config_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
      toast.success('Configuración del logo guardada exitosamente');
    } catch (error) {
      console.error('Error saving logo settings:', error);
      toast.error('Error al guardar la configuración del logo');
    } finally {
      setLoading(false);
    }
  };

  const addNavbarItem = () => {
    if (!newNavItem.name.trim() || !newNavItem.url.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const newItem: NavbarItem = {
      name: newNavItem.name,
      url: newNavItem.url,
      visible: true,
      order: navbarItems.length + 1
    };

    setNavbarItems([...navbarItems, newItem]);
    setNewNavItem({ name: '', url: '' });
  };

  const removeNavbarItem = (index: number) => {
    const updatedItems = navbarItems.filter((_, i) => i !== index);
    setNavbarItems(updatedItems);
  };

  const toggleNavbarItemVisibility = (index: number) => {
    const updatedItems = navbarItems.map((item, i) => 
      i === index ? { ...item, visible: !item.visible } : item
    );
    setNavbarItems(updatedItems);
  };

  const moveNavbarItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navbarItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      
      // Update order values
      newItems.forEach((item, i) => {
        item.order = i + 1;
      });
      
      setNavbarItems(newItems);
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
          <Card>
            <CardHeader>
              <CardTitle>Paleta de Colores</CardTitle>
              <CardDescription>
                Define los colores principales de tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">Color Primario</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={colorPalette.primary}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, primary: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={colorPalette.primary}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, primary: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color">Color Secundario</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={colorPalette.secondary}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, secondary: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={colorPalette.secondary}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, secondary: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="background-color">Color de Fondo</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="background-color"
                      type="color"
                      value={colorPalette.background}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, background: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={colorPalette.background}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, background: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text-color">Color de Texto</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={colorPalette.text}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, text: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={colorPalette.text}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, text: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accent-color">Color de Acento</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={colorPalette.accent}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, accent: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={colorPalette.accent}
                      onChange={(e) => setColorPalette(prev => ({ ...prev, accent: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={saveColorPalette} disabled={loading}>
                Guardar Paleta de Colores
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navbar">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Navbar</CardTitle>
              <CardDescription>
                Gestiona los elementos de navegación de tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new item */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Agregar Nuevo Elemento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nav-name">Nombre</Label>
                    <Input
                      id="nav-name"
                      value={newNavItem.name}
                      onChange={(e) => setNewNavItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Servicios"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nav-url">URL</Label>
                    <Input
                      id="nav-url"
                      value={newNavItem.url}
                      onChange={(e) => setNewNavItem(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="Ej: /servicios"
                    />
                  </div>
                </div>
                <Button onClick={addNavbarItem} className="mt-3">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Elemento
                </Button>
              </div>

              {/* Existing items */}
              <div className="space-y-3">
                <h4 className="font-medium">Elementos Existentes</h4>
                {navbarItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Badge variant={item.visible ? "default" : "secondary"}>
                      {item.order}
                    </Badge>
                    
                    <div className="flex-1">
                      <span className={`font-medium ${!item.visible ? 'text-gray-500' : ''}`}>
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({item.url})</span>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNavbarItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveNavbarItem(index, 'down')}
                        disabled={index === navbarItems.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleNavbarItemVisibility(index)}
                      >
                        {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNavbarItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={saveNavbarSettings} disabled={loading}>
                Guardar Configuración del Navbar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Logo</CardTitle>
              <CardDescription>
                Ajusta la posición y tamaño del logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="logo-position">Posición del Logo</Label>
                  <Select
                    value={logoSettings.position}
                    onValueChange={(value: 'left' | 'center' | 'right') => 
                      setLogoSettings(prev => ({ ...prev, position: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Izquierda</SelectItem>
                      <SelectItem value="center">Centro</SelectItem>
                      <SelectItem value="right">Derecha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="logo-height">Altura del Logo (px)</Label>
                  <Input
                    id="logo-height"
                    type="number"
                    value={logoSettings.height}
                    onChange={(e) => setLogoSettings(prev => ({ ...prev, height: parseInt(e.target.value) || 40 }))}
                    min="20"
                    max="80"
                  />
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-2">Vista Previa</h4>
                <div className="border bg-white rounded p-4">
                  <div className={`flex ${
                    logoSettings.position === 'left' ? 'justify-start' :
                    logoSettings.position === 'center' ? 'justify-center' : 'justify-end'
                  }`}>
                    <div 
                      className="bg-gray-300 rounded flex items-center justify-center text-gray-600 font-medium"
                      style={{ 
                        height: `${logoSettings.height}px`, 
                        width: `${logoSettings.height * 2}px` 
                      }}
                    >
                      LOGO
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={saveLogoSettings} disabled={loading}>
                Guardar Configuración del Logo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualDesignManager;
