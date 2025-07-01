import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';

interface NavbarItem {
  name: string;
  url: string;
  visible: boolean;
  order: number;
}

interface NavbarManagerProps {
  navbarItems: NavbarItem[];
  setNavbarItems: (items: NavbarItem[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const NavbarManager = ({ 
  navbarItems, 
  setNavbarItems, 
  loading, 
  setLoading 
}: NavbarManagerProps) => {
  const { user } = useAuth();
  const [newNavItem, setNewNavItem] = useState({ name: '', url: '' });

  const saveNavbarSettings = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_visual_config')
        .upsert({
          config_type: 'navbar_settings',
          config_data: { items: navbarItems } as any,
          is_active: true,
          updated_by: user?.id
        }, {
          onConflict: 'config_type,is_active'
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

  return (
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
  );
};

export default NavbarManager;
