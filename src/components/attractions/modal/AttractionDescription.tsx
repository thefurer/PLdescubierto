
import { MapPin, Clock, Users } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';

interface AttractionDescriptionProps {
  attraction: TouristAttraction;
}

export const AttractionDescription = ({ attraction }: AttractionDescriptionProps) => {
  const additionalInfo = attraction.additional_info || {};

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Historia y Descripción</h3>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          {attraction.description || 'Sin descripción disponible.'}
        </p>
      </div>

      {/* Additional Information */}
      {Object.keys(additionalInfo).length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Información Adicional</h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
            {additionalInfo.duration && (
              <div className="flex items-center text-xs sm:text-sm p-2 sm:p-0">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-primary flex-shrink-0" />
                <span>Duración: {additionalInfo.duration}</span>
              </div>
            )}
            {additionalInfo.capacity && (
              <div className="flex items-center text-xs sm:text-sm p-2 sm:p-0">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-green-primary flex-shrink-0" />
                <span>Capacidad: {additionalInfo.capacity}</span>
              </div>
            )}
            {additionalInfo.price && (
              <div className="flex items-center text-xs sm:text-sm p-2 sm:p-0">
                <span className="font-medium">Precio: {additionalInfo.price}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
