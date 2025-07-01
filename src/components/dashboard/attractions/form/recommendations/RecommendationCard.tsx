
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Edit2, X } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';

interface RecommendationCardProps {
  recommendation: TouristAttraction['recommendations'][0];
  onEdit: (rec: TouristAttraction['recommendations'][0]) => void;
  onRemove: (id: string) => void;
}

const RecommendationCard = ({ recommendation, onEdit, onRemove }: RecommendationCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 flex items-start">
            {/* Bullet point with recommendation color */}
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => onEdit(recommendation)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => onRemove(recommendation.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
