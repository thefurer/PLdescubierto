
import { useTranslations } from '@/hooks/useTranslations';

interface AttractionsHeaderProps {
  totalCount: number;
}

export const AttractionsHeader = ({
  totalCount
}: AttractionsHeaderProps) => {
  const t = useTranslations();
  
  return (
    <div className="text-center mb-16">
      <h2 className="animate-title text-4xl md:text-5xl font-bold text-ocean-dark mb-6 leading-tight">
        {totalCount} {t.attractionsMainTitle} <span className="text-green-primary animate-title-delay-1">{t.attractionsMainSubtitle}</span>
      </h2>
      <p className="animate-title-delay-2 text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
        {t.attractionsMainDescription}
      </p>
    </div>
  );
};
