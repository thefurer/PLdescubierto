
import { MapPin, Clock, Users } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';

interface AttractionDescriptionProps {
  attraction: TouristAttraction;
}

export const AttractionDescription = ({ attraction }: AttractionDescriptionProps) => {
  const additionalInfo = attraction.additional_info || {};

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Historia y Descripción</h3>
        <p className="text-gray-600 leading-relaxed">
          {attraction.description || 'Sin descripción disponible.'}
        </p>
      </div>

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
    </div>
  );
};
