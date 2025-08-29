
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';

interface ActivitiesTabProps {
  activities: string[];
  onActivitiesUpdate: (activities: string[]) => void;
}

const ActivitiesTab = ({ activities, onActivitiesUpdate }: ActivitiesTabProps) => {
  const [newActivity, setNewActivity] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const addActivity = () => {
    if (newActivity.trim()) {
      onActivitiesUpdate([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    onActivitiesUpdate(activities.filter((_, i) => i !== index));
  };

  const startEditing = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const updatedActivities = [...activities];
      updatedActivities[editingIndex] = editingValue.trim();
      onActivitiesUpdate(updatedActivities);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
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
              {editingIndex === index ? (
                <>
                  <Input 
                    value={editingValue} 
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit();
                      } else if (e.key === 'Escape') {
                        cancelEdit();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={saveEdit}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Input value={activity} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(index, activity)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Editar actividad"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeActivity(index)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar actividad"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
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
