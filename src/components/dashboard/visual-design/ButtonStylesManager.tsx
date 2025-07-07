
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointer, Square, Circle, Pill, Sparkles, Eye, Save, RefreshCw } from 'lucide-react';
import { useVisualConfig } from '@/hooks/useVisualConfig';
import { toast } from 'sonner';

const ButtonStylesManager = () => {
  const { config, saveConfig, previewConfig, resetPreview, previewMode, loading } = useVisualConfig();
  const [localButtonStyles, setLocalButtonStyles] = useState(config.buttonStyles);
  const [realTimePreview, setRealTimePreview] = useState(true);

  const handleButtonStyleChange = (updates: Partial<typeof localButtonStyles>) => {
    const newStyles = { ...localButtonStyles, ...updates };
    setLocalButtonStyles(newStyles);
    
    if (realTimePreview) {
      previewConfig({ buttonStyles: newStyles });
    }
  };

  const handleSave = async () => {
    try {
      await saveConfig({ buttonStyles: localButtonStyles });
      toast.success('Estilos de botones guardados correctamente');
      resetPreview();
    } catch (error) {
      toast.error('Error al guardar los estilos');
    }
  };

  const handleReset = () => {
    setLocalButtonStyles(config.buttonStyles);
    resetPreview();
    toast.info('Estilos restablecidos');
  };

  const getButtonPreviewStyle = (isPrimary = true) => {
    // Ensure proper border radius application
    let borderRadius = '8px'; // default rounded
    
    if (localButtonStyles.primaryStyle === 'pill') {
      borderRadius = '9999px';
    } else if (localButtonStyles.primaryStyle === 'square') {
      borderRadius = '4px';
    }

    const baseStyle = {
      borderRadius,
      transition: 'all 0.2s ease-in-out',
      padding: '8px 16px',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
    };

    if (isPrimary) {
      return {
        ...baseStyle,
        backgroundColor: localButtonStyles.primaryColor,
        color: 'white',
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        color: localButtonStyles.secondaryColor,
        border: `2px solid ${localButtonStyles.secondaryColor}`,
      };
    }
  };

  const applyHoverEffect = (element: HTMLElement, isEntering: boolean) => {
    if (!isEntering) {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
      return;
    }

    switch (localButtonStyles.hoverEffect) {
      case 'scale':
        element.style.transform = 'scale(1.05)';
        break;
      case 'shadow':
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        break;
      case 'glow':
        const color = element.style.backgroundColor || localButtonStyles.primaryColor;
        element.style.boxShadow = `0 0 20px ${color}40`;
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Estilos de Botones
            </CardTitle>
            <CardDescription>
              Personaliza la apariencia y comportamiento de los botones
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={realTimePreview}
              onCheckedChange={setRealTimePreview}
              id="button-real-time-preview"
            />
            <Label htmlFor="button-real-time-preview" className="text-sm">
              Vista previa en tiempo real
            </Label>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estilo de forma */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Forma de los Botones</Label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={localButtonStyles.primaryStyle === 'square' ? 'default' : 'outline'}
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => handleButtonStyleChange({ primaryStyle: 'square' })}
            >
              <Square className="h-5 w-5" />
              <span className="text-xs">Cuadrado</span>
            </Button>
            <Button
              variant={localButtonStyles.primaryStyle === 'rounded' ? 'default' : 'outline'}
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => handleButtonStyleChange({ primaryStyle: 'rounded' })}
            >
              <div className="w-5 h-5 bg-current rounded-lg" />
              <span className="text-xs">Redondeado</span>
            </Button>
            <Button
              variant={localButtonStyles.primaryStyle === 'pill' ? 'default' : 'outline'}
              className="h-16 flex flex-col items-center justify-center gap-2"
              onClick={() => handleButtonStyleChange({ primaryStyle: 'pill' })}
            >
              <Pill className="h-5 w-5" />
              <span className="text-xs">Píldora</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Actual: <strong>{localButtonStyles.primaryStyle === 'pill' ? 'Píldora' : 
                             localButtonStyles.primaryStyle === 'square' ? 'Cuadrado' : 'Redondeado'}</strong>
          </p>
        </div>

        {/* Colores de botones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primary-button-color">Color del Botón Primario</Label>
            <div className="flex gap-2 mt-2">
              <div
                className="w-12 h-10 rounded border border-input cursor-pointer"
                style={{ backgroundColor: localButtonStyles.primaryColor }}
                onClick={() => {
                  const input = document.getElementById('primary-button-color-picker') as HTMLInputElement;
                  input?.click();
                }}
              />
              <Input
                id="primary-button-color-picker"
                type="color"
                value={localButtonStyles.primaryColor}
                onChange={(e) => handleButtonStyleChange({ primaryColor: e.target.value })}
                className="sr-only"
              />
              <Input
                value={localButtonStyles.primaryColor}
                onChange={(e) => handleButtonStyleChange({ primaryColor: e.target.value })}
                className="flex-1 font-mono text-sm"
                placeholder="#2563eb"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondary-button-color">Color del Botón Secundario</Label>
            <div className="flex gap-2 mt-2">
              <div
                className="w-12 h-10 rounded border border-input cursor-pointer"
                style={{ backgroundColor: localButtonStyles.secondaryColor }}
                onClick={() => {
                  const input = document.getElementById('secondary-button-color-picker') as HTMLInputElement;
                  input?.click();
                }}
              />
              <Input
                id="secondary-button-color-picker"
                type="color"
                value={localButtonStyles.secondaryColor}
                onChange={(e) => handleButtonStyleChange({ secondaryColor: e.target.value })}
                className="sr-only"
              />
              <Input
                value={localButtonStyles.secondaryColor}
                onChange={(e) => handleButtonStyleChange({ secondaryColor: e.target.value })}
                className="flex-1 font-mono text-sm"
                placeholder="#10b981"
              />
            </div>
          </div>
        </div>

        {/* Efecto hover */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Efecto al Pasar el Mouse</Label>
          <Select
            value={localButtonStyles.hoverEffect}
            onValueChange={(value: 'scale' | 'shadow' | 'glow') => 
              handleButtonStyleChange({ hoverEffect: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scale">Escalar (aumentar tamaño)</SelectItem>
              <SelectItem value="shadow">Sombra</SelectItem>
              <SelectItem value="glow">Brillo</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Actual: <strong>{localButtonStyles.hoverEffect === 'scale' ? 'Escalar' : 
                             localButtonStyles.hoverEffect === 'shadow' ? 'Sombra' : 'Brillo'}</strong>
          </p>
        </div>

        {/* Vista previa de botones */}
        <div>
          <Label className="text-sm font-medium mb-4 block flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Vista Previa de Botones
          </Label>
          <div className="border rounded-lg p-6 bg-muted/50">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button 
                  style={getButtonPreviewStyle(true)}
                  onMouseEnter={(e) => applyHoverEffect(e.currentTarget, true)}
                  onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false)}
                >
                  Botón Primario
                </button>
                <button 
                  style={getButtonPreviewStyle(false)}
                  onMouseEnter={(e) => applyHoverEffect(e.currentTarget, true)}
                  onMouseLeave={(e) => applyHoverEffect(e.currentTarget, false)}
                >
                  Botón Secundario
                </button>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Pasa el mouse sobre los botones para ver el efecto hover</p>
                <p>• Forma actual: <strong>{localButtonStyles.primaryStyle === 'pill' ? 'Píldora (bordes completamente redondeados)' : 
                                          localButtonStyles.primaryStyle === 'square' ? 'Cuadrado (bordes rectos)' : 'Redondeado (bordes suavemente curvos)'}</strong></p>
                <p>• Efecto hover: <strong>{localButtonStyles.hoverEffect === 'scale' ? 'Escalar' : 
                                           localButtonStyles.hoverEffect === 'shadow' ? 'Sombra' : 'Brillo'}</strong></p>
              </div>
            </div>
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
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Guardando...' : 'Guardar Estilos'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonStylesManager;
