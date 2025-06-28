
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Clock, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  recommendations?: string;
  color?: string;
}

interface ScheduleManagerProps {
  attractionId: string;
  currentSchedules: Schedule[];
  onSave: (schedules: Schedule[]) => void;
}

const ScheduleManager = ({ attractionId, currentSchedules, onSave }: ScheduleManagerProps) => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>(
    currentSchedules.length > 0 ? currentSchedules : [
      { day: 'Lunes', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#3B82F6' },
      { day: 'Martes', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#10B981' },
      { day: 'Miércoles', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#F59E0B' },
      { day: 'Jueves', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#EF4444' },
      { day: 'Viernes', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#8B5CF6' },
      { day: 'Sábado', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#F97316' },
      { day: 'Domingo', openTime: '08:00', closeTime: '17:00', isClosed: false, recommendations: '', color: '#06B6D4' }
    ]
  );

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
  ];

  const updateSchedule = (index: number, field: keyof Schedule, value: string | boolean) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const addCustomSchedule = () => {
    const newSchedule: Schedule = {
      day: `Evento ${schedules.length + 1}`,
      openTime: '09:00',
      closeTime: '18:00',
      isClosed: false,
      recommendations: '',
      color: colorOptions[schedules.length % colorOptions.length]
    };
    setSchedules([...schedules, newSchedule]);
  };

  const removeSchedule = (index: number) => {
    if (schedules.length > 1) {
      const updated = schedules.filter((_, i) => i !== index);
      setSchedules(updated);
    }
  };

  const handleSave = () => {
    onSave(schedules);
    toast({
      title: 'Horarios guardados',
      description: 'Los horarios y recomendaciones han sido actualizados correctamente.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestión de Horarios</h3>
          <p className="text-sm text-gray-600">Configura los horarios y recomendaciones para cada día</p>
        </div>
        <Button onClick={addCustomSchedule} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Horario
        </Button>
      </div>

      <div className="grid gap-4">
        {schedules.map((schedule, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: schedule.color }}
                  />
                  <Input
                    value={schedule.day}
                    onChange={(e) => updateSchedule(index, 'day', e.target.value)}
                    className="font-medium max-w-xs"
                    placeholder="Nombre del día/evento"
                  />
                  <Badge variant={schedule.isClosed ? 'destructive' : 'default'}>
                    {schedule.isClosed ? 'Cerrado' : 'Abierto'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {schedules.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSchedule(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!schedule.isClosed}
                    onCheckedChange={(checked) => updateSchedule(index, 'isClosed', !checked)}
                  />
                  <label className="text-sm font-medium">Abierto</label>
                </div>
                
                {!schedule.isClosed && (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        type="time"
                        value={schedule.openTime}
                        onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        type="time"
                        value={schedule.closeTime}
                        onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Color:</span>
                  <div className="flex gap-1">
                    {colorOptions.slice(0, 5).map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full border-2 ${
                          schedule.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSchedule(index, 'color', color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <label className="text-sm font-medium text-gray-700">Recomendaciones</label>
                </div>
                <Textarea
                  value={schedule.recommendations || ''}
                  onChange={(e) => updateSchedule(index, 'recommendations', e.target.value)}
                  placeholder="Consejos específicos para este día/horario (ej: Mejor momento para fotos, menos concurrido, etc.)"
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-primary hover:bg-green-600">
          Guardar Horarios y Recomendaciones
        </Button>
      </div>
    </div>
  );
};

export default ScheduleManager;
