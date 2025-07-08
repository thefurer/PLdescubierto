
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, DollarSign, Edit2, Save, X, Trash2, Plus } from 'lucide-react';

interface TravelPoint {
  id: string;
  name: string;
  description: string;
  category: 'tours' | 'playas' | 'cultura' | 'aventura';
  rating: number;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Muy Fácil';
  duration: string;
  price: string;
  bestTime: string;
  highlights: string[];
  image: string;
  coordinates?: { lat: number; lng: number };
}

interface TravelPointEditorProps {
  point: TravelPoint;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TravelPoint>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const TravelPointEditor = ({ point, isEditing, onEdit, onSave, onCancel, onDelete }: TravelPointEditorProps) => {
  const [editedPoint, setEditedPoint] = useState<TravelPoint>(point);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tours': return 'bg-blue-100 text-blue-800';
      case 'playas': return 'bg-cyan-100 text-cyan-800';
      case 'cultura': return 'bg-purple-100 text-purple-800';
      case 'aventura': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Muy Fácil': return 'bg-green-100 text-green-800';
      case 'Fácil': return 'bg-blue-100 text-blue-800';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addHighlight = () => {
    setEditedPoint({
      ...editedPoint,
      highlights: [...(editedPoint.highlights || []), '']
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...(editedPoint.highlights || [])];
    newHighlights[index] = value;
    setEditedPoint({
      ...editedPoint,
      highlights: newHighlights
    });
  };

  const removeHighlight = (index: number) => {
    setEditedPoint({
      ...editedPoint,
      highlights: editedPoint.highlights?.filter((_, i) => i !== index) || []
    });
  };

  const handleSave = () => {
    console.log('Saving travel point with data:', editedPoint);
    onSave(editedPoint);
  };

  const handleCoordinatesChange = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setEditedPoint({
        ...editedPoint,
        coordinates: {
          ...editedPoint.coordinates,
          [field]: numValue
        } as { lat: number; lng: number }
      });
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={editedPoint.name}
              onChange={(e) => setEditedPoint({ ...editedPoint, name: e.target.value })}
              placeholder="Nombre del punto"
            />
            <select
              value={editedPoint.category}
              onChange={(e) => setEditedPoint({ ...editedPoint, category: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="tours">Tours</option>
              <option value="playas">Playas</option>
              <option value="cultura">Cultura</option>
              <option value="aventura">Aventura</option>
            </select>
          </div>
          
          <Textarea
            value={editedPoint.description}
            onChange={(e) => setEditedPoint({ ...editedPoint, description: e.target.value })}
            placeholder="Descripción"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <Input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={editedPoint.rating}
                onChange={(e) => setEditedPoint({ ...editedPoint, rating: parseFloat(e.target.value) })}
                placeholder="4.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duración</label>
              <Input
                value={editedPoint.duration}
                onChange={(e) => setEditedPoint({ ...editedPoint, duration: e.target.value })}
                placeholder="3-4 horas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <Input
                value={editedPoint.price}
                onChange={(e) => setEditedPoint({ ...editedPoint, price: e.target.value })}
                placeholder="$25-40"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dificultad</label>
              <select
                value={editedPoint.difficulty}
                onChange={(e) => setEditedPoint({ ...editedPoint, difficulty: e.target.value as any })}
                className="w-full p-2 border rounded"
              >
                <option value="Muy Fácil">Muy Fácil</option>
                <option value="Fácil">Fácil</option>
                <option value="Moderado">Moderado</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mejor época</label>
              <Input
                value={editedPoint.bestTime}
                onChange={(e) => setEditedPoint({ ...editedPoint, bestTime: e.target.value })}
                placeholder="Todo el año"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Imagen URL</label>
            <Input
              value={editedPoint.image}
              onChange={(e) => setEditedPoint({ ...editedPoint, image: e.target.value })}
              placeholder="URL de la imagen"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitud</label>
              <Input
                type="number"
                step="any"
                value={editedPoint.coordinates?.lat || ''}
                onChange={(e) => handleCoordinatesChange('lat', e.target.value)}
                placeholder="-1.5667"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitud</label>
              <Input
                type="number"
                step="any"
                value={editedPoint.coordinates?.lng || ''}
                onChange={(e) => handleCoordinatesChange('lng', e.target.value)}
                placeholder="-80.7833"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Qué verás (Highlights)</label>
            <div className="space-y-2">
              {editedPoint.highlights?.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder="Highlight"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addHighlight}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Highlight
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{point.name}</h4>
            <Badge className={getCategoryColor(point.category)}>
              {point.category}
            </Badge>
            <Badge className={getDifficultyColor(point.difficulty)}>
              {point.difficulty}
            </Badge>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold">{point.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{point.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{point.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              <span>{point.price}</span>
            </div>
          </div>
          <div className="text-sm">
            <strong>Mejor época:</strong> {point.bestTime}
          </div>
          {point.coordinates && (
            <div className="text-sm">
              <strong>Coordenadas:</strong> {point.coordinates.lat}, {point.coordinates.lng}
            </div>
          )}
          {point.highlights && point.highlights.length > 0 && (
            <div className="mt-2">
              <strong className="text-sm">Qué verás:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {point.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TravelPointEditor;
