
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Underline, Focus, Keyboard, RotateCcw } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import LanguageToggle from './LanguageToggle';
import FontSizeControls from './FontSizeControls';
import ScreenReaderControls from './ScreenReaderControls';

interface AccessibilityControlsProps {
  compact?: boolean;
}

const AccessibilityControls = ({ compact = false }: AccessibilityControlsProps) => {
  const { 
    settings, 
    toggleHighContrast, 
    toggleUnderlineLinks,
    resetSettings,
    updateSettings 
  } = useAccessibility();

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Idioma */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Idioma</span>
          <LanguageToggle compact />
        </div>

        {/* Tamaño de fuente */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Fuente</span>
          <FontSizeControls compact />
        </div>

        {/* Controles compactos */}
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant={settings.highContrast ? "default" : "outline"}
            size="sm"
            onClick={toggleHighContrast}
            className="h-8 text-xs"
            aria-pressed={settings.highContrast}
          >
            <Eye className="h-3 w-3 mr-1" />
            Contraste
          </Button>

          <Button
            variant={settings.underlineLinks ? "default" : "outline"}
            size="sm"
            onClick={toggleUnderlineLinks}
            className="h-8 text-xs"
            aria-pressed={settings.underlineLinks}
          >
            <Underline className="h-3 w-3 mr-1" />
            Enlaces
          </Button>

          <Button
            variant={settings.reducedMotion ? "default" : "outline"}
            size="sm"
            onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
            className="h-8 text-xs"
            aria-pressed={settings.reducedMotion}
          >
            <Focus className="h-3 w-3 mr-1" />
            Sin anim.
          </Button>

          <ScreenReaderControls compact />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={resetSettings}
          className="w-full h-6 text-xs text-orange-600 hover:text-orange-700"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Restaurar
        </Button>
      </div>
    );
  }

  return (
    <div id="accessibility-options" className="space-y-3 animate-fade-in">
      {/* Idioma */}
      <LanguageToggle />

      {/* Tamaño de fuente */}
      <FontSizeControls />

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

      {/* Lector de pantalla funcional */}
      <ScreenReaderControls />

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
  );
};

export default AccessibilityControls;
