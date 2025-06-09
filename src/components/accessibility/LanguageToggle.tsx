
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageToggleProps {
  compact?: boolean;
}

const LanguageToggle = ({ compact = false }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  if (compact) {
    return (
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
    );
  }

  return (
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
  );
};

export default LanguageToggle;
