
import ScheduleManager from '../ScheduleManager';

interface SchedulesTabProps {
  attractionId: string;
  currentSchedules: any[];
  onSchedulesUpdate: (schedules: any[]) => void;
}

const SchedulesTab = ({ attractionId, currentSchedules, onSchedulesUpdate }: SchedulesTabProps) => {
  return (
    <ScheduleManager
      attractionId={attractionId}
      currentSchedules={currentSchedules}
      onSave={onSchedulesUpdate}
    />
  );
};

export default SchedulesTab;
