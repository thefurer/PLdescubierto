import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Compass, Edit2, Save, X, Trash2, Plus } from 'lucide-react';

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

interface TravelTipsEditorProps {
  tip: TravelTip;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TravelTip>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const TravelTipsEditor = ({ tip, isEditing, onEdit, onSave, onCancel, onDelete }: TravelTipsEditorProps) => {
  const [editedTip, setEditedTip] = useState<TravelTip>(tip);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'epoca':
        return <Star className="h-4 w-4" />;
      case 'items':
        return <Compass className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'epoca':
        return 'bg-blue-100 text-blue-800';
      case 'items':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const addItem = () => {
    setEditedTip({
      ...editedTip,
      items: [...(editedTip.items || []), '']
    });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...(editedTip.items || [])];
    newItems[index] = value;
    setEditedTip({
      ...editedTip,
      items: newItems
    });
  };

  const removeItem = (index: number) => {
    setEditedTip({
      ...editedTip,
      items: editedTip.items?.filter((_, i) => i !== index) || []
    });
  };

  const addSeasonalInfo = () => {
    setEditedTip({
      ...editedTip,
      seasonal: [...(editedTip.seasonal || []), { period: '', description: '' }]
    });
  };

  const updateSeasonalInfo = (index: number, field: 'period' | 'description', value: string) => {
    const newSeasonal = [...(editedTip.seasonal || [])];
    newSeasonal[index] = { ...newSeasonal[index], [field]: value };
    setEditedTip({
      ...editedTip,
      seasonal: newSeasonal
    });
  };

  const removeSeasonalInfo = (index: number) => {
    setEditedTip({
      ...editedTip,
      seasonal: editedTip.seasonal?.filter((_, i) => i !== index) || []
    });
  };

  const handleSave = () => {
    onSave(editedTip);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={editedTip.title}
              onChange={(e) => setEditedTip({ ...editedTip, title: e.target.value })}
              placeholder="Título"
            />
            <select
              value={editedTip.category}
              onChange={(e) => setEditedTip({ ...editedTip, category: e.target.value as any })}
              className="w-full p-2 border rounded"
            >
              <option value="epoca">Mejor época para visitar</option>
              <option value="items">Qué llevar</option>
            </select>
          </div>
          
          {editedTip.description && (
            <Textarea
              value={editedTip.description}
              onChange={(e) => setEditedTip({ ...editedTip, description: e.target.value })}
              placeholder="Descripción"
            />
          )}

          {editedTip.category === 'items' && (
            <div>
              <label className="block text-sm font-medium mb-2">Elementos para llevar</label>
              <div className="space-y-2">
                {editedTip.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder="Elemento"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
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

          {editedTip.category === 'epoca' && (
            <div>
              <label className="block text-sm font-medium mb-2">Información por temporada</label>
              <div className="space-y-2">
                {editedTip.seasonal?.map((season, index) => (
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
                        variant="outline"
                        size="sm"
                        onClick={() => removeSeasonalInfo(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
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
            <h4 className="font-semibold">{tip.title}</h4>
            <Badge className={getCategoryColor(tip.category)}>
              <div className="flex items-center gap-1">
                {getCategoryIcon(tip.category)}
                {tip.category === 'epoca' ? 'Época' : 'Items'}
              </div>
            </Badge>
          </div>
          
          {tip.description && (
            <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
          )}

          {tip.category === 'items' && tip.items && tip.items.length > 0 && (
            <div className="mt-2">
              <strong className="text-sm">Elementos:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {tip.items.map((item, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tip.category === 'epoca' && tip.seasonal && tip.seasonal.length > 0 && (
            <div className="mt-2 space-y-1">
              {tip.seasonal.map((season, index) => (
                <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                  <strong className="text-blue-800">{season.period}:</strong> {season.description}
                </div>
              ))}
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

export default TravelTipsEditor;