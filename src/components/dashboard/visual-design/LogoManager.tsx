
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image, X } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LogoManager = () => {
  const { config, saveConfig, loading } = useVisualConfig();
  const [localLogoSettings, setLocalLogoSettings] = useState(config.logoSettings);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleSave = async () => {
    const settingsToSave = { ...localLogoSettings };
    if (logoUrl) {
      settingsToSave.logoUrl = logoUrl;
    }
    await saveConfig({ logoSettings: settingsToSave });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('El archivo debe ser menor a 2MB');
      return;
    }

    try {
      setUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast.success('Logo subido exitosamente');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Error al subir el logo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
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
        {/* Logo Upload Section */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Subir Logo</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
            {logoUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    className="max-h-20 object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Logo subido exitosamente</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={uploading} asChild>
                      <span>
                        {uploading ? 'Subiendo...' : 'Seleccionar Logo'}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, SVG hasta 2MB
                </p>
              </div>
            )}
          </div>
        </div>

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
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo preview" 
                  style={{ height: `${localLogoSettings.height}px` }}
                  className="object-contain"
                />
              ) : (
                <div 
                  className="bg-gray-300 rounded flex items-center justify-center text-gray-600 font-medium"
                  style={{ 
                    height: `${localLogoSettings.height}px`, 
                    width: `${localLogoSettings.height * 2}px` 
                  }}
                >
                  LOGO
                </div>
              )}
            </div>
          </div>
        </div>

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
