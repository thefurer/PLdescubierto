
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface ColorPaletteManagerProps {
  colorPalette: ColorPalette;
  setColorPalette: React.Dispatch<React.SetStateAction<ColorPalette>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const ColorPaletteManager = ({ 
  colorPalette, 
  setColorPalette, 
  loading, 
  setLoading 
}: ColorPaletteManagerProps) => {
  const { user } = useAuth();

  const saveColorPalette = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_visual_config')
        .upsert({
          config_type: 'color_palette',
          config_data: colorPalette as any,
          is_active: true,
          updated_by: user?.id
        }, {
          onConflict: 'config_type,is_active'
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

  return (
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
  );
};

export default ColorPaletteManager;
