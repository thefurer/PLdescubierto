
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/hooks/useLanguage';
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
  Underline,
  Globe,
  Play,
  Pause
} from 'lucide-react';

interface AccessibilityToolbarProps {
  compact?: boolean;
}

const AccessibilityToolbar = ({ compact = false }: AccessibilityToolbarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const { 
    settings, 
    toggleHighContrast, 
    increaseFontSize, 
    decreaseFontSize, 
    toggleUnderlineLinks,
    resetSettings,
    updateSettings 
  } = useAccessibility();
  const { language, setLanguage } = useLanguage();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getFontSizeLabel = () => {
    const labels = {
      small: 'S',
      medium: 'M',
      large: 'L',
      'extra-large': 'XL'
    };
    return labels[settings.fontSize];
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const toggleScreenReader = () => {
    if (isReading) {
      // Detener lectura
      speechSynthesis.cancel();
      setIsReading(false);
    } else {
      // Iniciar lectura
      const textContent = document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      
      speechSynthesis.speak(utterance);
      setIsReading(true);
    }
    updateSettings({ screenReaderOptimized: !settings.screenReaderOptimized });
  };

  if (compact) {
    return (
      <div className="relative" role="toolbar" aria-label="Herramientas de accesibilidad">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleExpanded}
          className="h-8 px-3 flex items-center gap-2"
          aria-expanded={isExpanded}
          aria-controls="accessibility-options"
          aria-label={isExpanded ? 'Ocultar opciones de accesibilidad' : 'Mostrar opciones de accesibilidad'}
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">Accesibilidad</span>
        </Button>

        {isExpanded && (
          <Card className="absolute top-10 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-2 border-green-primary min-w-[300px]">
            <CardContent className="p-3">
              <div className="space-y-2">
                {/* Idioma */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Idioma</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="h-6 px-2 text-xs"
                    aria-label={`Cambiar a ${language === 'es' ? 'inglés' : 'español'}`}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {language.toUpperCase()}
                  </Button>
                </div>

                {/* Tamaño de fuente */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Fuente</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseFontSize}
                      className="h-6 w-6 p-0"
                      aria-label="Disminuir tamaño de fuente"
                      disabled={settings.fontSize === 'small'}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Badge variant="secondary" className="h-6 min-w-[24px] text-xs">
                      {getFontSizeLabel()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseFontSize}
                      className="h-6 w-6 p-0"
                      aria-label="Aumentar tamaño de fuente"
                      disabled={settings.fontSize === 'extra-large'}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
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

                  <Button
                    variant={isReading ? "default" : "outline"}
                    size="sm"
                    onClick={toggleScreenReader}
                    className="h-8 text-xs"
                    aria-pressed={isReading}
                  >
                    {isReading ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                    Lector
                  </Button>
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
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Version original para pantallas grandes o usos específicos
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
              {/* Idioma */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="w-full justify-start"
                aria-label={`Cambiar idioma a ${language === 'es' ? 'inglés' : 'español'}`}
              >
                <Globe className="h-4 w-4 mr-2" />
                Idioma: {language.toUpperCase()}
              </Button>

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

              {/* Lector de pantalla funcional */}
              <Button
                variant={isReading ? "default" : "outline"}
                size="sm"
                onClick={toggleScreenReader}
                className="w-full justify-start"
                aria-pressed={isReading}
                aria-label={isReading ? 'Detener lectura de página' : 'Iniciar lectura de página'}
              >
                {isReading ? <Pause className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {isReading ? 'Detener lectura' : 'Leer página'} {isReading && '🔊'}
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
