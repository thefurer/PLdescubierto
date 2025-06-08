import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Toggle } from '@/components/ui/toggle';
const LanguageSelector = () => {
  const {
    language,
    setLanguage
  } = useLanguage();
  return <Toggle pressed={language === 'en'} onPressedChange={pressed => setLanguage(pressed ? 'en' : 'es')} className="flex items-center gap-2 backdrop-blur-sm text-slate-700 bg-slate-300 hover:bg-slate-200">
      <Globe size={16} className="bg-slate-50" />
      <span className="text-[#000202]/[0.99]">{language.toUpperCase()}</span>
    </Toggle>;
};
export default LanguageSelector;