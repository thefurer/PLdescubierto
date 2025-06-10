
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, X, AlertCircle } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';
import AttractionImageManager from './AttractionImageManager';
import { useToast } from '@/hooks/use-toast';

interface AttractionEditFormProps {
  attraction: TouristAttraction;
  isSaving: boolean;
  isUploading: boolean;
  onSave: (updates: Partial<TouristAttraction>) => void;
  onCancel: () => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const AttractionEditForm = ({ 
  attraction, 
  isSaving,
  isUploading,
  onSave, 
  onCancel,
  onUploadImage
}: AttractionEditFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: attraction.name,
    description: attraction.description || '',
    category: attraction.category,
    image_url: attraction.image_url || ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.category) {
      errors.category = 'La categoría es obligatoria';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor complete todos los campos obligatorios',
        variant: 'destructive'
      });
      return;
    }

    try {
      console.log('Saving attraction with data:', formData);
      await onSave(formData);
    } catch (error) {
      console.error('Error saving attraction:', error);
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
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
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (formErrors.name) {
              setFormErrors(prev => ({ ...prev, name: '' }));
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
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descripción de la atracción"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Categoría *
        </label>
        <Select
          value={formData.category}
          onValueChange={(value) => {
            setFormData(prev => ({ 
              ...prev, 
              category: value as 'todo' | 'playa' | 'cultura' | 'naturaleza'
            }));
            if (formErrors.category) {
              setFormErrors(prev => ({ ...prev, category: '' }));
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

      <AttractionImageManager
        currentImageUrl={formData.image_url}
        attractionId={attraction.id}
        isUploading={isUploading}
        onImageUpdate={handleImageUpdate}
        onUploadImage={onUploadImage}
      />

      <div className="flex gap-2 pt-4 border-t">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || isUploading}
          size="sm"
          className="flex-1"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isSaving || isUploading}
          size="sm"
          className="flex-1"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default AttractionEditForm;
