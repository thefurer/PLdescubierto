
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
      <h3 className="text-lg font-semibold mb-4">Horarios de Atención</h3>
      <div className="space-y-3">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700">{schedule.day}</span>
            {schedule.isClosed ? (
              <span className="text-red-500 font-semibold">Cerrado</span>
            ) : (
              <span className="text-green-primary font-semibold">
                {schedule.openTime} - {schedule.closeTime}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Los horarios pueden variar según la temporada. Se recomienda confirmar antes de su visita.
        </p>
      </div>
    </div>
  );
};
