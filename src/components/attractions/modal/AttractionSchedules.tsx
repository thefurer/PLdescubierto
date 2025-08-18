
import { TouristAttraction } from '@/types/touristAttractions';
import { useTranslations } from '@/hooks/useTranslations';

interface AttractionSchedulesProps {
  attraction: TouristAttraction;
}

export const AttractionSchedules = ({ attraction }: AttractionSchedulesProps) => {
  const additionalInfo = attraction.additional_info || {};
  const t = useTranslations();
  
  // Get schedules from database or use default with translations
  const schedules = additionalInfo.schedules || [
    { day: t.weekdays, openTime: '8:00', closeTime: '18:00', isClosed: false },
    { day: t.saturday, openTime: '9:00', closeTime: '20:00', isClosed: false },
    { day: t.sunday, openTime: '10:00', closeTime: '17:00', isClosed: false }
  ];

  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t.attentionSchedules}</h3>
      <div className="space-y-2 sm:space-y-3">
        {schedules.map((schedule, index) => (
          <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-700 text-xs sm:text-sm">{schedule.day}</span>
            {schedule.isClosed ? (
              <span className="text-red-500 font-semibold text-xs sm:text-sm">{t.closed}</span>
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
          <strong>{t.note}:</strong> {t.scheduleNote}
        </p>
      </div>
    </div>
  );
};
