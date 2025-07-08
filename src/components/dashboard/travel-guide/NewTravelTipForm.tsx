import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, X } from 'lucide-react';

interface TravelTip {
  id: string;
  category: 'epoca' | 'items';
  title: string;
  description?: string;
  items?: string[];
  seasonal?: {
    period: string;
    description: string;
  }[];
}

interface NewTravelTipFormProps {
  onAdd: (tip: Partial<TravelTip>) => void;
  loading?: boolean;
}

const NewTravelTipForm = ({ onAdd, loading }: NewTravelTipFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTip, setNewTip] = useState<Partial<TravelTip>>({
    title: '',
    category: 'epoca',
    description: '',
    items: [],
    seasonal: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTip.title) return;

    onAdd(newTip);
    setNewTip({
      title: '',
      category: 'epoca',
      description: '',
      items: [],
      seasonal: []
    });
    setIsOpen(false);
  };

  const addItem = () => {
    setNewTip({
      ...newTip,
      items: [...(newTip.items || []), '']
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...(newTip.items || [])];
    newItems[index] = value;
    setNewTip({
      ...newTip,
      items: newItems
    });
  };

  const removeItem = (index: number) => {
    setNewTip({
      ...newTip,
      items: newTip.items?.filter((_, i) => i !== index) || []
    });
  };

  const addSeasonalInfo = () => {
    setNewTip({
      ...newTip,
      seasonal: [...(newTip.seasonal || []), { period: '', description: '' }]
    });
  };

  const updateSeasonalInfo = (index: number, field: 'period' | 'description', value: string) => {
    const newSeasonal = [...(newTip.seasonal || [])];
    newSeasonal[index] = { ...newSeasonal[index], [field]: value };
    setNewTip({
      ...newTip,
      seasonal: newSeasonal
    });
  };

  const removeSeasonalInfo = (index: number) => {
    setNewTip({
      ...newTip,
      seasonal: newTip.seasonal?.filter((_, i) => i !== index) || []
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Consejo de Viaje
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nuevo Consejo de Viaje</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={newTip.title || ''}
              onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
              placeholder="Título del consejo"
              required
            />
            <select
              value={newTip.category}
              onChange={(e) => setNewTip({ ...newTip, category: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="epoca">Mejor época para visitar</option>
              <option value="items">Qué llevar</option>
            </select>
          </div>

          <Textarea
            value={newTip.description || ''}
            onChange={(e) => setNewTip({ ...newTip, description: e.target.value })}
            placeholder="Descripción (opcional)"
          />

          {newTip.category === 'items' && (
            <div>
              <label className="block text-sm font-medium mb-2">Elementos para llevar</label>
              <div className="space-y-2">
                {newTip.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder="Elemento"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Elemento
                </Button>
              </div>
            </div>
          )}

          {newTip.category === 'epoca' && (
            <div>
              <label className="block text-sm font-medium mb-2">Información por temporada</label>
              <div className="space-y-2">
                {newTip.seasonal?.map((season, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={season.period}
                      onChange={(e) => updateSeasonalInfo(index, 'period', e.target.value)}
                      placeholder="Período (ej: Junio - Septiembre)"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={season.description}
                        onChange={(e) => updateSeasonalInfo(index, 'description', e.target.value)}
                        placeholder="Descripción"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSeasonalInfo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSeasonalInfo}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Temporada
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !newTip.title}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Consejo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewTravelTipForm;