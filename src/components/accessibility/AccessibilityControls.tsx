
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Underline, Focus, Keyboard, RotateCcw } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import LanguageToggle from './LanguageToggle';
import FontSizeControls from './FontSizeControls';
import ScreenReaderControls from './ScreenReaderControls';
import AccessibilityGuide from './AccessibilityGuide';
import AccessibilityTestMode from './AccessibilityTestMode';

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
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Aumenta el contraste para mejor visibilidad</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Subraya todos los enlaces para mejor identificación</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>Reduce las animaciones para evitar distracciones</p>
            </TooltipContent>
          </Tooltip>

          <ScreenReaderControls compact />
        </div>

        {/* Herramientas adicionales */}
        <div className="flex gap-1 pt-2 border-t border-slate-200">
          <AccessibilityGuide />
          <AccessibilityTestMode />
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
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Aumenta el contraste entre texto y fondo para mejorar la legibilidad</p>
          <p className="text-xs text-slate-400">Especialmente útil en condiciones de poca luz</p>
        </TooltipContent>
      </Tooltip>

      {/* Subrayado de enlaces */}
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Subraya todos los enlaces para facilitar su identificación</p>
          <p className="text-xs text-slate-400">Útil para usuarios con daltonismo o dificultades visuales</p>
        </TooltipContent>
      </Tooltip>

      {/* Movimiento reducido */}
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Reduce las animaciones y transiciones para evitar mareos o distracciones</p>
          <p className="text-xs text-slate-400">Recomendado para usuarios sensibles al movimiento</p>
        </TooltipContent>
      </Tooltip>

      {/* Lector de pantalla funcional */}
      <ScreenReaderControls />

      {/* Indicadores de foco */}
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>Resalta visualmente el elemento activo durante la navegación por teclado</p>
          <p className="text-xs text-slate-400">Esencial para navegación sin mouse</p>
        </TooltipContent>
      </Tooltip>

      {/* Herramientas adicionales */}
      <div className="flex gap-2 pt-3 border-t border-slate-200">
        <AccessibilityGuide />
        <AccessibilityTestMode />
      </div>

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
