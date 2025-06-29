
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    category: 'todo' | 'playa' | 'cultura' | 'naturaleza';
    additional_info: any;
  };
  formErrors: Record<string, string>;
  onFormDataChange: (updates: Partial<TouristAttraction>) => void;
  onErrorClear: (field: string) => void;
}

const BasicInfoTab = ({ formData, formErrors, onFormDataChange, onErrorClear }: BasicInfoTabProps) => {
  const updateAdditionalInfo = (key: string, value: string) => {
    onFormDataChange({
      additional_info: {
        ...formData.additional_info,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Nombre *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => {
            onFormDataChange({ name: e.target.value });
            if (formErrors.name) {
              onErrorClear('name');
            }
          }}
          placeholder="Nombre de la atracción"
          className={formErrors.name ? 'border-red-500' : ''}
        />
        {formErrors.name && (
          <div className="flex items-center mt-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {formErrors.name}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Descripción
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          placeholder="Descripción de la atracción"
          rows={4}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Categoría *
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) => {
            onFormDataChange({ 
              category: value as 'todo' | 'playa' | 'cultura' | 'naturaleza'
            });
            if (formErrors.category) {
              onErrorClear('category');
            }
          }}
        >
          <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="playa">Playa</SelectItem>
            <SelectItem value="cultura">Cultura</SelectItem>
            <SelectItem value="naturaleza">Naturaleza</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.category && (
          <div className="flex items-center mt-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {formErrors.category}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información Adicional</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            value={formData.additional_info.duration || ''}
            onChange={(e) => updateAdditionalInfo('duration', e.target.value)}
            placeholder="Duración (ej: 2-3 horas)"
          />
          <Input
            value={formData.additional_info.capacity || ''}
            onChange={(e) => updateAdditionalInfo('capacity', e.target.value)}
            placeholder="Capacidad (ej: 20 personas max)"
          />
          <Input
            value={formData.additional_info.price || ''}
            onChange={(e) => updateAdditionalInfo('price', e.target.value)}
            placeholder="Precio (ej: $15 por persona)"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
