
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';
import { Badge } from '@/components/ui/badge';

interface AttractionDescriptionProps {
  attraction: TouristAttraction;
}

export const AttractionDescription = ({ attraction }: AttractionDescriptionProps) => {
  const additionalInfo = attraction.additional_info || {};
  const recommendations = attraction.recommendations || [];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Historia y Descripción</h3>
        <p className="text-gray-600 leading-relaxed">
          {attraction.description || 'Sin descripción disponible.'}
        </p>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recomendaciones</h3>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-2">
                <Star className="h-4 w-4 mt-0.5 text-amber-500 fill-current flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{rec.text}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rec.color && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          borderColor: rec.color, 
                          color: rec.color 
                        }}
                      >
                        Categoría
                      </Badge>
                    )}
                    {rec.dates && rec.dates.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {rec.dates.join(', ')}
                      </Badge>
                    )}
                    {rec.schedule && (
                      <Badge variant="secondary" className="text-xs">
                        {new Date(rec.schedule.startDate).toLocaleDateString()} - {new Date(rec.schedule.endDate).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {Object.keys(additionalInfo).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Información Adicional</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalInfo.duration && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-green-primary" />
                <span>Duración: {additionalInfo.duration}</span>
              </div>
            )}
            {additionalInfo.capacity && (
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-green-primary" />
                <span>Capacidad: {additionalInfo.capacity}</span>
              </div>
            )}
            {additionalInfo.price && (
              <div className="flex items-center text-sm">
                <span className="font-medium">Precio: {additionalInfo.price}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center text-sm text-gray-600">
        <MapPin className="h-4 w-4 mr-2 text-green-primary" />
        <span>Puerto López, Ecuador</span>
      </div>
    </div>
  );
};
