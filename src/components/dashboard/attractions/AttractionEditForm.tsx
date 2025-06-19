
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { TouristAttraction } from '@/hooks/useTouristAttractions';
import AttractionImageManager from './AttractionImageManager';
import GalleryImageManager from './GalleryImageManager';
import ScheduleManager from './ScheduleManager';
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
    additional_info: attraction.additional_info || {},
    schedules: attraction.additional_info?.schedules || []
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
      const updatedData = {
        ...formData,
        additional_info: {
          ...formData.additional_info,
          schedules: formData.schedules
        }
      };
      await onSave(updatedData);
    } catch (error) {
      console.error('Error saving attraction:', error);
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleGalleryUpdate = (images: string[]) => {
    setFormData(prev => ({ ...prev, gallery_images: images }));
  };

  const handleSchedulesUpdate = (schedules: any[]) => {
    setFormData(prev => ({ ...prev, schedules }));
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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="activities">Actividades</TabsTrigger>
          <TabsTrigger value="schedules">Horarios</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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

          {/* Información Adicional */}
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
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <AttractionImageManager
            currentImageUrl={formData.image_url}
            attractionId={attraction.id}
            isUploading={isUploading}
            onImageUpdate={handleImageUpdate}
            onUploadImage={onUploadImage}
          />

          <GalleryImageManager
            attractionId={attraction.id}
            currentImages={formData.gallery_images}
            isUploading={isUploading}
            onImagesUpdate={handleGalleryUpdate}
            onUploadImage={onUploadImage}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="schedules">
          <ScheduleManager
            attractionId={attraction.id}
            currentSchedules={formData.schedules}
            onSave={handleSchedulesUpdate}
          />
        </TabsContent>
      </Tabs>

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
