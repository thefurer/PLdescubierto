
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TouristAttraction } from '@/types/touristAttractions';
import { useToast } from '@/hooks/use-toast';
import BasicInfoTab from './form/BasicInfoTab';
import ImagesTab from './form/ImagesTab';
import ActivitiesTab from './form/ActivitiesTab';
import SchedulesTab from './form/SchedulesTab';
import FormActions from './form/FormActions';

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
    recommendations: attraction.recommendations || '',
    image_url: attraction.image_url || '',
    gallery_images: attraction.gallery_images || [],
    activities: attraction.activities || [],
    additional_info: attraction.additional_info || {}
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
      await onSave(formData);
    } catch (error) {
      console.error('Error saving attraction:', error);
    }
  };

  const handleFormDataChange = (updates: Partial<TouristAttraction>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleErrorClear = (field: string) => {
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageUpdate = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleGalleryUpdate = (images: string[]) => {
    setFormData(prev => ({ ...prev, gallery_images: images }));
  };

  const handleActivitiesUpdate = (activities: string[]) => {
    setFormData(prev => ({ ...prev, activities }));
  };

  const handleSchedulesUpdate = (schedules: any[]) => {
    setFormData(prev => ({
      ...prev,
      additional_info: {
        ...prev.additional_info,
        schedules: schedules
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

        <TabsContent value="basic">
          <BasicInfoTab
            formData={formData}
            formErrors={formErrors}
            onFormDataChange={handleFormDataChange}
            onErrorClear={handleErrorClear}
          />
        </TabsContent>

        <TabsContent value="images">
          <ImagesTab
            attractionId={attraction.id}
            currentImageUrl={formData.image_url}
            currentGalleryImages={formData.gallery_images}
            isUploading={isUploading}
            onImageUpdate={handleImageUpdate}
            onGalleryUpdate={handleGalleryUpdate}
            onUploadImage={onUploadImage}
          />
        </TabsContent>

        <TabsContent value="activities">
          <ActivitiesTab
            activities={formData.activities}
            onActivitiesUpdate={handleActivitiesUpdate}
          />
        </TabsContent>

        <TabsContent value="schedules">
          <SchedulesTab
            attractionId={attraction.id}
            currentSchedules={formData.additional_info.schedules || []}
            onSchedulesUpdate={handleSchedulesUpdate}
          />
        </TabsContent>
      </Tabs>

      <FormActions
        isSaving={isSaving}
        isUploading={isUploading}
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default AttractionEditForm;
