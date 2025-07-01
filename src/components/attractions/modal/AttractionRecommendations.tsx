
import { TouristAttraction } from '@/types/touristAttractions';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface AttractionRecommendationsProps {
  attraction: TouristAttraction;
}

export const AttractionRecommendations = ({ attraction }: AttractionRecommendationsProps) => {
  const recommendations = attraction.recommendations || [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="flex items-start">
              {/* Colored bullet point */}
              <div 
                className="w-3 h-3 rounded-full mr-3 mt-1 flex-shrink-0"
                style={{ backgroundColor: recommendation.color || '#3B82F6' }}
              ></div>
              <div className="flex-1">
                <p className="text-sm mb-2">{recommendation.text}</p>
                <div className="flex flex-wrap gap-1">
                  {recommendation.dates && recommendation.dates.map(date => (
                    <Badge key={date} variant="secondary" className="text-xs">
                      {date}
                    </Badge>
                  ))}
                  {recommendation.schedule && (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(recommendation.schedule.startDate).toLocaleDateString()} - {new Date(recommendation.schedule.endDate).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No hay recomendaciones disponibles para esta atracción.</p>
      )}
    </div>
  );
};
