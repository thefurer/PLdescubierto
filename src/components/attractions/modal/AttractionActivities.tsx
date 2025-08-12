
import { TouristAttraction } from '@/types/touristAttractions';

interface AttractionActivitiesProps {
  attraction: TouristAttraction;
}

export const AttractionActivities = ({ attraction }: AttractionActivitiesProps) => {
  const activities = attraction.activities || [];

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Actividades Disponibles</h3>
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-primary rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
              <span className="font-medium">{activity}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm sm:text-base">No hay actividades específicas registradas para esta atracción.</p>
      )}
    </div>
  );
};
