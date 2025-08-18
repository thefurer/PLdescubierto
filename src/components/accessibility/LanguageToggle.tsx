
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslations } from '@/hooks/useTranslations';

interface LanguageToggleProps {
  compact?: boolean;
}

const LanguageToggle = ({ compact = false }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="h-8 w-10 px-2 text-sm font-semibold"
        aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a español'}
      >
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
      aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a español'}
    >
      <Globe className="h-4 w-4 mr-2" />
      {language === 'es' ? 'Idioma' : 'Language'}: {language.toUpperCase()}
    </Button>
  );
};

export default LanguageToggle;
