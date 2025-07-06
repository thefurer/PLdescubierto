
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { toast } from 'sonner';
import LogoUploadZone from './logo/LogoUploadZone';
import LogoSettings from './logo/LogoSettings';
import LogoPreview from './logo/LogoPreview';

const LogoManager = () => {
  const { config, saveConfig, loading } = useVisualConfig();
  const { uploading, uploadLogo } = useLogoUpload();
  const [localLogoSettings, setLocalLogoSettings] = useState(config.logoSettings);

  useEffect(() => {
    setLocalLogoSettings(config.logoSettings);
  }, [config.logoSettings]);

  const handleSave = async () => {
    await saveConfig({ logoSettings: localLogoSettings });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadLogo(file);
      
      const updatedSettings = { ...localLogoSettings, logoUrl: publicUrl };
      setLocalLogoSettings(updatedSettings);
      
      await saveConfig({ logoSettings: updatedSettings });
      
      toast.success('Logo subido y guardado exitosamente');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error al subir el logo');
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const updatedSettings = { ...localLogoSettings };
      delete updatedSettings.logoUrl;
      
      setLocalLogoSettings(updatedSettings);
      
      await saveConfig({ logoSettings: updatedSettings });
      
      toast.success('Logo eliminado exitosamente');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Error al eliminar el logo');
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setLocalLogoSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Configuración del Logo
        </CardTitle>
        <CardDescription>
          Sube y configura tu logo personalizado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LogoUploadZone
          logoUrl={localLogoSettings.logoUrl}
          uploading={uploading}
          onUpload={handleLogoUpload}
          onRemove={handleRemoveLogo}
        />

        <LogoSettings
          position={localLogoSettings.position}
          height={localLogoSettings.height}
          onPositionChange={(value) => handleSettingChange('position', value)}
          onHeightChange={(value) => handleSettingChange('height', value)}
        />

        <LogoPreview
          logoUrl={localLogoSettings.logoUrl}
          position={localLogoSettings.position}
          height={localLogoSettings.height}
        />

        <Button 
          onClick={handleSave} 
          disabled={loading || uploading}
          className="w-full"
        >
          {loading ? 'Guardando...' : 'Guardar Configuración del Logo'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LogoManager;
