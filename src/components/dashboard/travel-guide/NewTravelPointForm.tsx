
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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

interface NewTravelPointFormProps {
  onAdd: (point: Partial<TravelPoint>) => void;
  loading: boolean;
}

const NewTravelPointForm = ({ onAdd, loading }: NewTravelPointFormProps) => {
  const [newPoint, setNewPoint] = useState<Partial<TravelPoint>>({});

  const handleAdd = () => {
    if (!newPoint.name || !newPoint.description) return;
    onAdd(newPoint);
    setNewPoint({});
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            value={newPoint.name || ''}
            onChange={(e) => setNewPoint({ ...newPoint, name: e.target.value })}
            placeholder="Nombre del nuevo punto"
          />
          <select
            value={newPoint.category || 'tours'}
            onChange={(e) => setNewPoint({ ...newPoint, category: e.target.value as any })}
            className="w-full p-2 border rounded"
          >
            <option value="tours">Tours</option>
            <option value="playas">Playas</option>
            <option value="cultura">Cultura</option>
            <option value="aventura">Aventura</option>
          </select>
        </div>
        
        <Textarea
          value={newPoint.description || ''}
          onChange={(e) => setNewPoint({ ...newPoint, description: e.target.value })}
          placeholder="Descripción del punto"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={newPoint.rating || ''}
            onChange={(e) => setNewPoint({ ...newPoint, rating: parseFloat(e.target.value) })}
            placeholder="Rating (4.5)"
          />
          <Input
            value={newPoint.duration || ''}
            onChange={(e) => setNewPoint({ ...newPoint, duration: e.target.value })}
            placeholder="Duración (3-4 horas)"
          />
          <Input
            value={newPoint.price || ''}
            onChange={(e) => setNewPoint({ ...newPoint, price: e.target.value })}
            placeholder="Precio ($25-40)"
          />
        </div>
        
        <Button onClick={handleAdd} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Punto
        </Button>
      </div>
    </div>
  );
};

export default NewTravelPointForm;
