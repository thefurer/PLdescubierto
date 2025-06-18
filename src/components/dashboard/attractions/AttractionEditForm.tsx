
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';
import AttractionImageManager from './AttractionImageManager';
import { useToast } from '@/hooks/use-toast';

interface AttractionEditFormProps {
  attraction: TouristAttraction;
  isSaving: boolean;
  isUploading: boolean;
  onSave: (updates: Partial<TouristAttraction>) => Promise<void>;
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
    image_url: attraction.image_url || '',
    gallery_images: attraction.gallery_images || [],
    activities: attraction.activities || [],
    additional_info: attraction.additional_info || {}
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newActivity, setNewActivity] = useState('');

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

  const addActivity = () => {
    if (newActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  const updateAdditionalInfo = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        [key]: value
      }
    }));
  };

  const addGalleryImage = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, imageUrl]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
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

      {/* Imagen Principal */}
      <AttractionImageManager
        currentImageUrl={formData.image_url}
        attractionId={attraction.id}
        isUploading={isUploading}
        onImageUpdate={handleImageUpdate}
        onUploadImage={onUploadImage}
      />

      {/* Galería de Imágenes */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Galería de Imágenes (máximo 5)
        </label>
        <div className="space-y-2">
          {formData.gallery_images.map((image, index) => (
            <div key={index} className="flex items-center space-x-2">
              <img src={image} alt={`Galería ${index + 1}`} className="w-16 h-16 object-cover rounded" />
              <Input value={image} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeGalleryImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.gallery_images.length < 5 && (
            <div className="text-sm text-gray-500">
              Las imágenes de galería se pueden agregar subiendo imágenes adicionales desde el gestor de imágenes principal.
            </div>
          )}
        </div>
      </div>

      {/* Actividades */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Actividades
        </label>
        <div className="space-y-2">
          {formData.activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input value={activity} readOnly className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeActivity(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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

      {/* Información Adicional */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Información Adicional
        </label>
        <div className="space-y-2">
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
