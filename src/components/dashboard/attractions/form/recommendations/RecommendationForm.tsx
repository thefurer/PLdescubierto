
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Save, X } from 'lucide-react';
import ColorPicker from './ColorPicker';
import DateManager from './DateManager';

interface RecommendationFormProps {
  formData: {
    text: string;
    color: string;
    dates: string[];
    schedule: { startDate: string; endDate: string };
  };
  newDate: string;
  editingId: string | null;
  onFormDataChange: (updates: any) => void;
  onNewDateChange: (date: string) => void;
  onAddDate: () => void;
  onRemoveDate: (date: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const RecommendationForm = ({
  formData,
  newDate,
  editingId,
  onFormDataChange,
  onNewDateChange,
  onAddDate,
  onRemoveDate,
  onSubmit,
  onCancel
}: RecommendationFormProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="recommendation-text">
              {editingId ? 'Editar Recomendación' : 'Texto de la Recomendación'}
            </Label>
            <Textarea
              id="recommendation-text"
              value={formData.text}
              onChange={(e) => onFormDataChange({ text: e.target.value })}
              placeholder="Escribe la recomendación..."
              rows={3}
            />
          </div>

          <ColorPicker
            selectedColor={formData.color}
            onColorChange={(color) => onFormDataChange({ color })}
          />

          <DateManager
            dates={formData.dates}
            newDate={newDate}
            onNewDateChange={onNewDateChange}
            onAddDate={onAddDate}
            onRemoveDate={onRemoveDate}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Fecha de Inicio</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.schedule.startDate}
                onChange={(e) => onFormDataChange({
                  schedule: { ...formData.schedule, startDate: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="end-date">Fecha de Fin</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.schedule.endDate}
                onChange={(e) => onFormDataChange({
                  schedule: { ...formData.schedule, endDate: e.target.value }
                })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {editingId ? (
              <>
                <Button onClick={onSubmit} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
                <Button onClick={onCancel} variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={onSubmit} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Recomendación
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationForm;
