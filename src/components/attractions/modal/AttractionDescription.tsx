
import { TouristAttraction } from '@/types/touristAttractions';

interface AttractionDescriptionProps {
  attraction: TouristAttraction;
}

export const AttractionDescription = ({ attraction }: AttractionDescriptionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-ocean-dark mb-3">Descripción</h3>
        <p className="text-gray-700 leading-relaxed">
          {attraction.description || 'Descripción no disponible.'}
        </p>
      </div>
      
      {attraction.recommendations && (
        <div>
          <h3 className="text-lg font-semibold text-ocean-dark mb-3">Recomendaciones</h3>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {attraction.recommendations}
            </p>
          </div>
        </div>
      )}
      
      {attraction.additional_info && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          {attraction.additional_info.duration && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 block">Duración</span>
              <span className="font-semibold text-ocean-dark">{attraction.additional_info.duration}</span>
            </div>
          )}
          {attraction.additional_info.capacity && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 block">Capacidad</span>
              <span className="font-semibold text-ocean-dark">{attraction.additional_info.capacity}</span>
            </div>
          )}
          {attraction.additional_info.price && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 block">Precio</span>
              <span className="font-semibold text-ocean-dark">{attraction.additional_info.price}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
