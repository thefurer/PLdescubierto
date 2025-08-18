
import { TouristAttraction } from '@/types/touristAttractions';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface AttractionRecommendationsProps {
  attraction: TouristAttraction;
}

export const AttractionRecommendations = ({ attraction }: AttractionRecommendationsProps) => {
  const recommendations = attraction.recommendations || [];
  const t = useTranslations();

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t.recommendations}</h3>
      {recommendations.length > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="flex items-start p-2 sm:p-0">
              {/* Colored bullet point */}
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 mt-1 flex-shrink-0"
                style={{ backgroundColor: recommendation.color || '#3B82F6' }}
              ></div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm mb-2">{recommendation.text}</p>
                <div className="flex flex-wrap gap-1">
                  {recommendation.dates && recommendation.dates.map(date => (
                    <Badge key={date} variant="secondary" className="text-xs">
                      {date}
                    </Badge>
                  ))}
                  {recommendation.schedule && (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      <span className="hidden sm:inline">
                        {new Date(recommendation.schedule.startDate).toLocaleDateString()} - {new Date(recommendation.schedule.endDate).toLocaleDateString()}
                      </span>
                      <span className="sm:hidden">
                        {new Date(recommendation.schedule.startDate).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm sm:text-base">{t.noRecommendations}</p>
      )}
    </div>
  );
};
