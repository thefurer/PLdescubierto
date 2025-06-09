
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Play, Pause } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/hooks/useLanguage';

interface ScreenReaderControlsProps {
  compact?: boolean;
}

const ScreenReaderControls = ({ compact = false }: ScreenReaderControlsProps) => {
  const [isReading, setIsReading] = useState(false);
  const { settings, updateSettings } = useAccessibility();
  const { language } = useLanguage();

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
    );
  }

  return (
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
  );
};

export default ScreenReaderControls;
