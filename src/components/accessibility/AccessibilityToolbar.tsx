
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import {
  Settings,
  Plus,
  Minus,
  Eye,
  Volume2,
  Keyboard,
  Focus,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Underline
} from 'lucide-react';

const AccessibilityToolbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    settings, 
    toggleHighContrast, 
    increaseFontSize, 
    decreaseFontSize, 
    toggleUnderlineLinks,
    resetSettings,
    updateSettings 
  } = useAccessibility();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getFontSizeLabel = () => {
    const labels = {
      small: 'Pequeño',
      medium: 'Mediano',
      large: 'Grande',
      'extra-large': 'Extra Grande'
    };
    return labels[settings.fontSize];
  };

  return (
    <div className="fixed top-20 right-4 z-50" role="toolbar" aria-label="Herramientas de accesibilidad">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-green-primary">
        <CardContent className="p-3">
          {/* Botón principal */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpanded}
            className="w-full flex items-center justify-between mb-2"
            aria-expanded={isExpanded}
            aria-controls="accessibility-options"
            aria-label={isExpanded ? 'Ocultar opciones de accesibilidad' : 'Mostrar opciones de accesibilidad'}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
              <span>Accesibilidad</span>
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {isExpanded && (
            <div id="accessibility-options" className="space-y-3 animate-fade-in">
              {/* Tamaño de fuente */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamaño de fuente</label>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                    aria-label="Disminuir tamaño de fuente"
                    disabled={settings.fontSize === 'small'}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary" className="mx-2">
                    {getFontSizeLabel()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                    aria-label="Aumentar tamaño de fuente"
                    disabled={settings.fontSize === 'extra-large'}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Alto contraste */}
              <Button
                variant={settings.highContrast ? "default" : "outline"}
                size="sm"
                onClick={toggleHighContrast}
                className="w-full justify-start"
                aria-pressed={settings.highContrast}
                aria-label={settings.highContrast ? 'Desactivar alto contraste' : 'Activar alto contraste'}
              >
                <Eye className="h-4 w-4 mr-2" />
                Alto contraste {settings.highContrast && '✓'}
              </Button>

              {/* Subrayado de enlaces */}
              <Button
                variant={settings.underlineLinks ? "default" : "outline"}
                size="sm"
                onClick={toggleUnderlineLinks}
                className="w-full justify-start"
                aria-pressed={settings.underlineLinks}
                aria-label={settings.underlineLinks ? 'Desactivar subrayado de enlaces' : 'Activar subrayado de enlaces'}
              >
                <Underline className="h-4 w-4 mr-2" />
                Subrayar enlaces {settings.underlineLinks && '✓'}
              </Button>

              {/* Movimiento reducido */}
              <Button
                variant={settings.reducedMotion ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                className="w-full justify-start"
                aria-pressed={settings.reducedMotion}
                aria-label={settings.reducedMotion ? 'Desactivar movimiento reducido' : 'Activar movimiento reducido'}
              >
                <Focus className="h-4 w-4 mr-2" />
                Reducir animaciones {settings.reducedMotion && '✓'}
              </Button>

              {/* Optimización para lectores de pantalla */}
              <Button
                variant={settings.screenReaderOptimized ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ screenReaderOptimized: !settings.screenReaderOptimized })}
                className="w-full justify-start"
                aria-pressed={settings.screenReaderOptimized}
                aria-label={settings.screenReaderOptimized ? 'Desactivar optimización de lector de pantalla' : 'Activar optimización de lector de pantalla'}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Lector pantalla {settings.screenReaderOptimized && '✓'}
              </Button>

              {/* Indicadores de foco */}
              <Button
                variant={settings.focusIndicators ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ focusIndicators: !settings.focusIndicators })}
                className="w-full justify-start"
                aria-pressed={settings.focusIndicators}
                aria-label={settings.focusIndicators ? 'Desactivar indicadores de foco' : 'Activar indicadores de foco'}
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Foco visible {settings.focusIndicators && '✓'}
              </Button>

              {/* Resetear configuración */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetSettings}
                className="w-full justify-start text-orange-600 hover:text-orange-700"
                aria-label="Restaurar configuración predeterminada de accesibilidad"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restaurar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityToolbar;
