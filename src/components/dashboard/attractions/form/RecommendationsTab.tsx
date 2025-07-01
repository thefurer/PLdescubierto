import { useState } from 'react';
import { TouristAttraction } from '@/types/touristAttractions';
import RecommendationCard from './recommendations/RecommendationCard';
import RecommendationForm from './recommendations/RecommendationForm';

interface RecommendationsTabProps {
  recommendations: TouristAttraction['recommendations'];
  onRecommendationsUpdate: (recommendations: TouristAttraction['recommendations']) => void;
}

const RecommendationsTab = ({ recommendations = [], onRecommendationsUpdate }: RecommendationsTabProps) => {
  const [newRecommendation, setNewRecommendation] = useState({
    text: '',
    color: '#3B82F6',
    dates: [] as string[],
    schedule: { startDate: '', endDate: '' }
  });
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addRecommendation = () => {
    if (!newRecommendation.text.trim()) return;

    const recommendation = {
      id: Date.now().toString(),
      text: newRecommendation.text,
      color: newRecommendation.color,
      dates: newRecommendation.dates.length > 0 ? newRecommendation.dates : undefined,
      schedule: (newRecommendation.schedule.startDate && newRecommendation.schedule.endDate) 
        ? newRecommendation.schedule 
        : undefined
    };

    const updatedRecommendations = [...recommendations, recommendation];
    onRecommendationsUpdate(updatedRecommendations);
    
    resetForm();
  };

  const removeRecommendation = (id: string) => {
    const updatedRecommendations = recommendations.filter(rec => rec.id !== id);
    onRecommendationsUpdate(updatedRecommendations);
  };

  const startEditing = (rec: any) => {
    setEditingId(rec.id);
    setNewRecommendation({
      text: rec.text,
      color: rec.color || '#3B82F6',
      dates: rec.dates || [],
      schedule: rec.schedule || { startDate: '', endDate: '' }
    });
  };

  const saveEdit = () => {
    if (!newRecommendation.text.trim() || !editingId) return;

    const updatedRecommendations = recommendations.map(rec => 
      rec.id === editingId 
        ? {
            ...rec,
            text: newRecommendation.text,
            color: newRecommendation.color,
            dates: newRecommendation.dates.length > 0 ? newRecommendation.dates : undefined,
            schedule: (newRecommendation.schedule.startDate && newRecommendation.schedule.endDate) 
              ? newRecommendation.schedule 
              : undefined
          }
        : rec
    );
    
    onRecommendationsUpdate(updatedRecommendations);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setNewRecommendation({
      text: '',
      color: '#3B82F6',
      dates: [],
      schedule: { startDate: '', endDate: '' }
    });
  };

  const handleFormDataChange = (updates: any) => {
    setNewRecommendation(prev => ({ ...prev, ...updates }));
  };

  const addDate = () => {
    if (!newDate.trim() || newRecommendation.dates.includes(newDate.trim())) return;
    setNewRecommendation(prev => ({
      ...prev,
      dates: [...prev.dates, newDate.trim()]
    }));
    setNewDate('');
  };

  const removeDate = (dateToRemove: string) => {
    setNewRecommendation(prev => ({
      ...prev,
      dates: prev.dates.filter(date => date !== dateToRemove)
    }));
  };

  const handleSubmit = () => {
    if (editingId) {
      saveEdit();
    } else {
      addRecommendation();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
        
        {/* Existing Recommendations */}
        <div className="space-y-3 mb-6">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onEdit={startEditing}
              onRemove={removeRecommendation}
            />
          ))}
        </div>

        {/* Add/Edit Recommendation Form */}
        <RecommendationForm
          formData={newRecommendation}
          newDate={newDate}
          editingId={editingId}
          onFormDataChange={handleFormDataChange}
          onNewDateChange={setNewDate}
          onAddDate={addDate}
          onRemoveDate={removeDate}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </div>
    </div>
  );
};

export default RecommendationsTab;
