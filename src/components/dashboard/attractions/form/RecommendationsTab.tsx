import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, Calendar, Palette } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';

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

    onRecommendationsUpdate([...recommendations, recommendation]);
    setNewRecommendation({
      text: '',
      color: '#3B82F6',
      dates: [],
      schedule: { startDate: '', endDate: '' }
    });
  };

  const removeRecommendation = (id: string) => {
    onRecommendationsUpdate(recommendations.filter(rec => rec.id !== id));
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

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
        
        {/* Existing Recommendations */}
        <div className="space-y-3 mb-6">
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm mb-2">{rec.text}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.color && (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: rec.color, color: rec.color }}
                        >
                          <Palette className="h-3 w-3 mr-1" />
                          Color
                        </Badge>
                      )}
                      {rec.dates && rec.dates.map(date => (
                        <Badge key={date} variant="secondary" className="text-xs">
                          {date}
                        </Badge>
                      ))}
                      {rec.schedule && (
                        <Badge variant="secondary" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(rec.schedule.startDate).toLocaleDateString()} - {new Date(rec.schedule.endDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeRecommendation(rec.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Recommendation */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="recommendation-text">Texto de la Recomendación</Label>
                <Textarea
                  id="recommendation-text"
                  value={newRecommendation.text}
                  onChange={(e) => setNewRecommendation(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Escribe la recomendación..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Color de Categoría</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full border-2 ${
                        newRecommendation.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewRecommendation(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Fechas Específicas</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Ej: Enero-Marzo, Temporada alta..."
                  />
                  <Button type="button" onClick={addDate} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newRecommendation.dates.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newRecommendation.dates.map(date => (
                      <Badge key={date} variant="secondary" className="text-xs">
                        {date}
                        <button
                          type="button"
                          onClick={() => removeDate(date)}
                          className="ml-1 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Fecha de Inicio</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newRecommendation.schedule.startDate}
                    onChange={(e) => setNewRecommendation(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, startDate: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Fecha de Fin</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newRecommendation.schedule.endDate}
                    onChange={(e) => setNewRecommendation(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, endDate: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <Button onClick={addRecommendation} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Recomendación
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecommendationsTab;
