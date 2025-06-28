
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface Schedule {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface ScheduleManagerProps {
  attractionId: string;
  currentSchedules?: Schedule[];
  onSave: (schedules: Schedule[]) => void;
}

const DAYS_OF_WEEK = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00'
];

const ScheduleManager = ({ attractionId, currentSchedules = [], onSave }: ScheduleManagerProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    if (currentSchedules.length > 0) {
      return currentSchedules;
    }
    
    // Default schedules for all days
    return DAYS_OF_WEEK.map(day => ({
      day,
      openTime: '08:00',
      closeTime: '18:00',
      isClosed: false
    }));
  });

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);

  const updateSchedule = (index: number, field: keyof Schedule, value: string | boolean) => {
    const newSchedules = [...schedules];
    newSchedules[index] = {
      ...newSchedules[index],
      [field]: value
    };
    setSchedules(newSchedules);
  };

  const handleSave = () => {
    if (isTemporarilyClosed) {
      // If temporarily closed, mark all days as closed
      const closedSchedules = schedules.map(schedule => ({
        ...schedule,
        isClosed: true
      }));
      onSave(closedSchedules);
    } else {
      onSave(schedules);
    }
  };

  const copyToAllDays = (sourceIndex: number) => {
    const sourceSchedule = schedules[sourceIndex];
    const newSchedules = schedules.map(schedule => ({
      ...schedule,
      openTime: sourceSchedule.openTime,
      closeTime: sourceSchedule.closeTime,
      isClosed: sourceSchedule.isClosed
    }));
    setSchedules(newSchedules);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Gestión de Horarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Temporarily Closed Toggle */}
        <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Switch
            id="temporarily-closed"
            checked={isTemporarilyClosed}
            onCheckedChange={setIsTemporarilyClosed}
          />
          <Label htmlFor="temporarily-closed" className="text-sm font-medium">
            Cerrado temporalmente
          </Label>
        </div>

        {!isTemporarilyClosed && (
          <div className="space-y-4">
            {schedules.map((schedule, index) => (
              <div key={schedule.day} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{schedule.day}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToAllDays(index)}
                      className="text-xs"
                    >
                      Aplicar a todos
                    </Button>
                    <Switch
                      checked={!schedule.isClosed}
                      onCheckedChange={(checked) => updateSchedule(index, 'isClosed', !checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {schedule.isClosed ? 'Cerrado' : 'Abierto'}
                    </span>
                  </div>
                </div>

                {!schedule.isClosed && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-600">Hora de apertura</Label>
                      <Select
                        value={schedule.openTime}
                        onValueChange={(value) => updateSchedule(index, 'openTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm text-gray-600">Hora de cierre</Label>
                      <Select
                        value={schedule.closeTime}
                        onValueChange={(value) => updateSchedule(index, 'closeTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1">
            <Clock className="h-4 w-4 mr-2" />
            Guardar Horarios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleManager;
