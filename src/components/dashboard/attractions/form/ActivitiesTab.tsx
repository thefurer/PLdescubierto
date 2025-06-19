
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ActivitiesTabProps {
  activities: string[];
  onActivitiesUpdate: (activities: string[]) => void;
}

const ActivitiesTab = ({ activities, onActivitiesUpdate }: ActivitiesTabProps) => {
  const [newActivity, setNewActivity] = useState('');

  const addActivity = () => {
    if (newActivity.trim()) {
      onActivitiesUpdate([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    onActivitiesUpdate(activities.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Actividades
        </label>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input value={activity} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeActivity(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex space-x-2">
            <Input
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Nueva actividad"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addActivity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTab;
