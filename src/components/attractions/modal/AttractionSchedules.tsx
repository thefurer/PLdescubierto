
import { TouristAttraction } from '@/types/touristAttractions';

interface AttractionSchedulesProps {
  attraction: TouristAttraction;
}

export const AttractionSchedules = ({ attraction }: AttractionSchedulesProps) => {
  const additionalInfo = attraction.additional_info || {};
  
  // Get schedules from database or use default
  const schedules = additionalInfo.schedules || [
    { day: 'Lunes - Viernes', openTime: '8:00', closeTime: '18:00', isClosed: false },
    { day: 'Sábados', openTime: '9:00', closeTime: '20:00', isClosed: false },
    { day: 'Domingos', openTime: '10:00', closeTime: '17:00', isClosed: false }
  ];

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Horarios de Atención</h3>
      <div className="space-y-2 sm:space-y-3">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700 text-xs sm:text-sm">{schedule.day}</span>
            {schedule.isClosed ? (
              <span className="text-red-500 font-semibold text-xs sm:text-sm">Cerrado</span>
            ) : (
              <span className="text-green-primary font-semibold text-xs sm:text-sm">
                {schedule.openTime} - {schedule.closeTime}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-700">
          <strong>Nota:</strong> Los horarios pueden variar según la temporada. Se recomienda confirmar antes de su visita.
        </p>
      </div>
    </div>
  );
};
