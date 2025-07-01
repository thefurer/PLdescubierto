
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from 'sonner';

interface LogoSettings {
  position: 'left' | 'center' | 'right';
  size: 'standard';
  height: number;
  margin: string;
}

interface LogoManagerProps {
  logoSettings: LogoSettings;
  setLogoSettings: (settings: LogoSettings) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LogoManager = ({ 
  logoSettings, 
  setLogoSettings, 
  loading, 
  setLoading 
}: LogoManagerProps) => {
  const { user } = useAuth();

  const saveLogoSettings = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('site_visual_config')
        .upsert({
          config_type: 'logo_settings',
          config_data: logoSettings as any,
          is_active: true,
          updated_by: user?.id
        }, {
          onConflict: 'config_type,is_active'
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

  return (
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
  );
};

export default LogoManager;
