
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface DateManagerProps {
  dates: string[];
  newDate: string;
  onNewDateChange: (date: string) => void;
  onAddDate: () => void;
  onRemoveDate: (date: string) => void;
}

const DateManager = ({ 
  dates, 
  newDate, 
  onNewDateChange, 
  onAddDate, 
  onRemoveDate 
}: DateManagerProps) => {
  return (
    <div>
      <Label>Fechas Específicas</Label>
      <div className="flex gap-2 mt-2">
        <Input
          value={newDate}
          onChange={(e) => onNewDateChange(e.target.value)}
          placeholder="Ej: Enero-Marzo, Temporada alta..."
        />
        <Button type="button" onClick={onAddDate} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {dates.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {dates.map(date => (
            <Badge key={date} variant="secondary" className="text-xs">
              {date}
              <button
                type="button"
                onClick={() => onRemoveDate(date)}
                className="ml-1 text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateManager;
