
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, ArrowUp, ArrowDown, Eye, EyeOff, Navigation, Palette, Save, RefreshCw } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { toast } from 'sonner';

const EnhancedNavbarManager = () => {
  const { config, saveConfig, previewConfig, resetPreview, previewMode, loading } = useVisualConfig();
  const [localNavbar, setLocalNavbar] = useState(config.navbarSettings);
  const [newNavItem, setNewNavItem] = useState({ name: '', url: '' });
  const [realTimePreview, setRealTimePreview] = useState(true);

  const handleNavbarChange = (updates: Partial<typeof localNavbar>) => {
    const newNavbar = { ...localNavbar, ...updates };
    setLocalNavbar(newNavbar);
    
    if (realTimePreview) {
      previewConfig({ navbarSettings: newNavbar });
    }
  };

  const addNavbarItem = () => {
    if (!newNavItem.name.trim() || !newNavItem.url.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Validate URL format - ensure it starts with # for sections
    let formattedUrl = newNavItem.url.trim();
    if (!formattedUrl.startsWith('#') && !formattedUrl.startsWith('/') && !formattedUrl.startsWith('http')) {
      formattedUrl = `#${formattedUrl}`;
    }

    const newItem = {
      name: newNavItem.name.trim(),
      url: formattedUrl,
      visible: true,
      order: localNavbar.items.length + 1
    };

    const updatedItems = [...localNavbar.items, newItem];
    handleNavbarChange({ items: updatedItems });
    setNewNavItem({ name: '', url: '' });
    toast.success('Elemento agregado correctamente');
  };

  const removeNavbarItem = (index: number) => {
    const updatedItems = localNavbar.items.filter((_, i) => i !== index);
    // Reorder items
    const reorderedItems = updatedItems.map((item, i) => ({ ...item, order: i + 1 }));
    handleNavbarChange({ items: reorderedItems });
  };

  const toggleNavbarItemVisibility = (index: number) => {
    const updatedItems = localNavbar.items.map((item, i) => 
      i === index ? { ...item, visible: !item.visible } : item
    );
    handleNavbarChange({ items: updatedItems });
  };

  const moveNavbarItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...localNavbar.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      
      // Update order values
      newItems.forEach((item, i) => {
        item.order = i + 1;
      });
      
      handleNavbarChange({ items: newItems });
    }
  };

  const updateNavbarItem = (index: number, field: 'name' | 'url', value: string) => {
    const updatedItems = localNavbar.items.map((item, i) => {
      if (i === index) {
        let finalValue = value;
        if (field === 'url' && value && !value.startsWith('#') && !value.startsWith('/') && !value.startsWith('http')) {
          finalValue = `#${value}`;
        }
        return { ...item, [field]: finalValue };
      }
      return item;
    });
    handleNavbarChange({ items: updatedItems });
  };

  const handleSave = async () => {
    try {
      await saveConfig({ navbarSettings: localNavbar });
      toast.success('Configuración del navbar guardada correctamente');
      resetPreview();
    } catch (error) {
      toast.error('Error al guardar la configuración');
    }
  };

  const handleReset = () => {
    setLocalNavbar(config.navbarSettings);
    resetPreview();
    toast.info('Configuración restablecida');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Configuración Avanzada del Navbar
              </CardTitle>
              <CardDescription>
                Personaliza la navegación, colores y comportamiento del navbar
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={realTimePreview}
                onCheckedChange={setRealTimePreview}
                id="navbar-real-time-preview"
              />
              <Label htmlFor="navbar-real-time-preview" className="text-sm">
                Vista previa en tiempo real
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuración de Colores */}
          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colores del Navbar
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="navbar-bg">Color de Fondo</Label>
                <div className="flex gap-2 mt-2">
                  <div
                    className="w-12 h-10 rounded border border-input cursor-pointer"
                    style={{ backgroundColor: localNavbar.backgroundColor }}
                    onClick={() => {
                      const input = document.getElementById('navbar-bg-color') as HTMLInputElement;
                      input?.click();
                    }}
                  />
                  <Input
                    id="navbar-bg-color"
                    type="color"
                    value={localNavbar.backgroundColor}
                    onChange={(e) => handleNavbarChange({ backgroundColor: e.target.value })}
                    className="sr-only"
                  />
                  <Input
                    value={localNavbar.backgroundColor}
                    onChange={(e) => handleNavbarChange({ backgroundColor: e.target.value })}
                    className="flex-1 font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="navbar-text">Color del Texto</Label>
                <div className="flex gap-2 mt-2">
                  <div
                    className="w-12 h-10 rounded border border-input cursor-pointer"
                    style={{ backgroundColor: localNavbar.textColor }}
                    onClick={() => {
                      const input = document.getElementById('navbar-text-color') as HTMLInputElement;
                      input?.click();
                    }}
                  />
                  <Input
                    id="navbar-text-color"
                    type="color"
                    value={localNavbar.textColor}
                    onChange={(e) => handleNavbarChange({ textColor: e.target.value })}
                    className="sr-only"
                  />
                  <Input
                    value={localNavbar.textColor}
                    onChange={(e) => handleNavbarChange({ textColor: e.target.value })}
                    className="flex-1 font-mono text-sm"
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de Posición */}
          <div>
            <h4 className="text-sm font-medium mb-3">Comportamiento del Navbar</h4>
            <div>
              <Label htmlFor="navbar-position">Posición</Label>
              <Select
                value={localNavbar.position}
                onValueChange={(value: 'fixed' | 'static') => 
                  handleNavbarChange({ position: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fijo (permanece visible al hacer scroll)</SelectItem>
                  <SelectItem value="static">Estático (se oculta al hacer scroll)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agregar nuevo elemento */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Nuevo Elemento
            </h4>
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
                <Label htmlFor="nav-url">URL o Sección</Label>
                <Input
                  id="nav-url"
                  value={newNavItem.url}
                  onChange={(e) => setNewNavItem(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Ej: #servicios o /servicios"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Para secciones de la página usa # (ej: #hero), para páginas externas usa / o http://
            </p>
            <Button onClick={addNavbarItem} className="mt-3" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Elemento
            </Button>
          </div>

          {/* Elementos existentes */}
          <div>
            <h4 className="font-medium mb-3">Elementos de Navegación</h4>
            <div className="space-y-3">
              {localNavbar.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                  <Badge variant={item.visible ? "default" : "secondary"}>
                    {item.order}
                  </Badge>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={item.name}
                      onChange={(e) => updateNavbarItem(index, 'name', e.target.value)}
                      placeholder="Nombre"
                      className="text-sm"
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => updateNavbarItem(index, 'url', e.target.value)}
                      placeholder="URL"
                      className="text-sm font-mono"
                    />
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveNavbarItem(index, 'up')}
                      disabled={index === 0}
                      title="Mover arriba"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveNavbarItem(index, 'down')}
                      disabled={index === localNavbar.items.length - 1}
                      title="Mover abajo"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleNavbarItemVisibility(index)}
                      title={item.visible ? 'Ocultar' : 'Mostrar'}
                    >
                      {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeNavbarItem(index)}
                      className="text-red-600 hover:text-red-700"
                      title="Eliminar"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
                <RefreshCw className="h-4 w-4 mr-2" />
                Restablecer
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedNavbarManager;
