
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVisualConfig } from '@/hooks/useVisualConfig';

const LogoManager = () => {
  const { config, saveConfig, loading } = useVisualConfig();
  const [localLogoSettings, setLocalLogoSettings] = useState(config.logoSettings);

  const handleSave = async () => {
    await saveConfig({ logoSettings: localLogoSettings });
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
              value={localLogoSettings.position}
              onValueChange={(value: 'left' | 'center' | 'right') => 
                setLocalLogoSettings(prev => ({ ...prev, position: value }))
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
              value={localLogoSettings.height}
              onChange={(e) => setLocalLogoSettings(prev => ({ ...prev, height: parseInt(e.target.value) || 40 }))}
              min="20"
              max="80"
            />
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-2">Vista Previa</h4>
          <div className="border bg-white rounded p-4">
            <div className={`flex ${
              localLogoSettings.position === 'left' ? 'justify-start' :
              localLogoSettings.position === 'center' ? 'justify-center' : 'justify-end'
            }`}>
              <div 
                className="bg-gray-300 rounded flex items-center justify-center text-gray-600 font-medium"
                style={{ 
                  height: `${localLogoSettings.height}px`, 
                  width: `${localLogoSettings.height * 2}px` 
                }}
              >
                LOGO
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading}>
          Guardar Configuración del Logo
        </Button>
      </CardContent>
    </Card>
  );
};

export default LogoManager;
