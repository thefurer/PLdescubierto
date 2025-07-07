
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit2, Save, X, Trash2, Plus } from 'lucide-react';

interface TransportOption {
  id: string;
  name: string;
  description: string;
  totalTime: string;
  price: string;
  pros: string[];
  icon: string;
  details: string;
}

interface TransportOptionEditorProps {
  option: TransportOption;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<TransportOption>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const TransportOptionEditor = ({ option, isEditing, onEdit, onSave, onCancel, onDelete }: TransportOptionEditorProps) => {
  const [editedOption, setEditedOption] = useState<TransportOption>(option);

  const addPro = () => {
    setEditedOption({
      ...editedOption,
      pros: [...(editedOption.pros || []), '']
    });
  };

  const updatePro = (index: number, value: string) => {
    const newPros = [...(editedOption.pros || [])];
    newPros[index] = value;
    setEditedOption({
      ...editedOption,
      pros: newPros
    });
  };

  const removePro = (index: number) => {
    setEditedOption({
      ...editedOption,
      pros: editedOption.pros?.filter((_, i) => i !== index) || []
    });
  };

  const handleSave = () => {
    onSave(editedOption);
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={editedOption.name}
              onChange={(e) => setEditedOption({ ...editedOption, name: e.target.value })}
              placeholder="Nombre del transporte"
            />
            <Input
              value={editedOption.icon}
              onChange={(e) => setEditedOption({ ...editedOption, icon: e.target.value })}
              placeholder="Icono (plane, bus, car)"
            />
          </div>
          
          <Textarea
            value={editedOption.description}
            onChange={(e) => setEditedOption({ ...editedOption, description: e.target.value })}
            placeholder="Descripción"
          />
          
          <Textarea
            value={editedOption.details}
            onChange={(e) => setEditedOption({ ...editedOption, details: e.target.value })}
            placeholder="Detalles adicionales"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              value={editedOption.totalTime}
              onChange={(e) => setEditedOption({ ...editedOption, totalTime: e.target.value })}
              placeholder="Tiempo total"
            />
            <Input
              value={editedOption.price}
              onChange={(e) => setEditedOption({ ...editedOption, price: e.target.value })}
              placeholder="Precio"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Ventajas</label>
            <div className="space-y-2">
              {editedOption.pros?.map((pro, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={pro}
                    onChange={(e) => updatePro(index, e.target.value)}
                    placeholder="Ventaja"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePro(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addPro}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ventaja
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
          <h4 className="font-semibold mb-2">{option.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
          {option.details && (
            <p className="text-sm text-gray-500 mb-2">{option.details}</p>
          )}
          <div className="flex gap-4 text-sm mb-2">
            {option.totalTime && <span><strong>Tiempo:</strong> {option.totalTime}</span>}
            {option.price && <span><strong>Precio:</strong> {option.price}</span>}
          </div>
          {option.pros && option.pros.length > 0 && (
            <div>
              <strong className="text-sm">Ventajas:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {option.pros.map((pro, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {pro}
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

export default TransportOptionEditor;
