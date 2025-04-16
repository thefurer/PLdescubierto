
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Toggle } from '@/components/ui/toggle';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Toggle
      pressed={language === 'en'}
      onPressedChange={(pressed) => setLanguage(pressed ? 'en' : 'es')}
      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
    >
      <Globe size={16} />
      <span>{language.toUpperCase()}</span>
    </Toggle>
  );
};

export default LanguageSelector;
