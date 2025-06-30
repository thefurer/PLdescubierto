
import { useTranslations } from '@/hooks/useTranslations';

interface AttractionsHeaderProps {
  totalCount: number;
}

export const AttractionsHeader = ({
  totalCount
}: AttractionsHeaderProps) => {
  const t = useTranslations();
  
  return (
    <div className="text-center mb-16 container-enhanced">
      <div className="title-enter">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ocean-dark mb-6 leading-tight">
          {totalCount} {t.attractionsMainTitle}{" "}
          <span className="text-green-primary bg-gradient-to-r from-green-primary to-green-dark bg-clip-text text-transparent">
            {t.attractionsMainSubtitle}
          </span>
        </h2>
      </div>
      
      <div className="section-enter">
        <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
          {t.attractionsMainDescription}
        </p>
      </div>
      
      {/* Decorative line */}
      <div className="mt-8 flex items-center justify-center">
        <div className="h-px bg-gradient-to-r from-transparent via-green-primary to-transparent w-24"></div>
        <div className="mx-4 w-2 h-2 bg-green-primary rounded-full"></div>
        <div className="h-px bg-gradient-to-r from-transparent via-green-primary to-transparent w-24"></div>
      </div>
    </div>
  );
};
