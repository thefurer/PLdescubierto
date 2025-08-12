
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import ImageUploader from '@/components/dashboard/ImageUploader';

interface HeroEditFormProps {
  formData: any;
  updateFormField: (field: string, value: string | string[]) => void;
  handleImageUpload: (imageUrl: string) => void;
  saving: boolean;
}

const HeroEditForm = ({ formData, updateFormField, handleImageUpload, saving }: HeroEditFormProps) => {
  const backgroundImages = formData.backgroundImages || [formData.backgroundImage].filter(Boolean);

  const addImageToCarousel = (imageUrl: string) => {
    const currentImages = backgroundImages.filter(img => img);
    const updatedImages = [...currentImages, imageUrl];
    updateFormField('backgroundImages', updatedImages);
    
    // Keep the first image as the main backgroundImage for backwards compatibility
    if (!formData.backgroundImage) {
      updateFormField('backgroundImage', imageUrl);
    }
  };

  const removeImageFromCarousel = (index: number) => {
    const updatedImages = backgroundImages.filter((_, i) => i !== index);
    updateFormField('backgroundImages', updatedImages);
    
    // Update the main backgroundImage to the first remaining image
    if (updatedImages.length > 0) {
      updateFormField('backgroundImage', updatedImages[0]);
    } else {
      updateFormField('backgroundImage', '');
    }
  };

  const addImageUrl = (url: string) => {
    if (url.trim()) {
      addImageToCarousel(url.trim());
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
            Título Principal
          </Label>
          <Input
            id="title"
            value={formData.title || ''}
            onChange={(e) => updateFormField('title', e.target.value)}
            placeholder="Título principal (ej: Puerto López)"
            className="bg-white border-gray-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle" className="text-sm font-semibold text-gray-700">
            Subtítulo
          </Label>
          <Input
            id="subtitle"
            value={formData.subtitle || ''}
            onChange={(e) => updateFormField('subtitle', e.target.value)}
            placeholder="Subtítulo (ej: Descubre sus Atracciones)"
            className="bg-white border-gray-200 focus:border-blue-400"
          />
        </div>
      </div>
      <div className="mb-6">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
          Descripción
        </Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => updateFormField('description', e.target.value)}
          placeholder="Descripción corta (ej: Bellezas Naturales y Culturales)"
          rows={2}
          className="mt-2 bg-white border-gray-200 focus:border-blue-400"
        />
      </div>
      
      <Separator className="my-6" />
      
      {/* Carousel Images Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-gray-700">
            Imágenes del Carrusel de Portada
          </Label>
          <span className="text-sm text-gray-500">
            {backgroundImages.length} imagen{backgroundImages.length !== 1 ? 'es' : ''}
          </span>
        </div>
        
        {/* Current Images */}
        {backgroundImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {backgroundImages.map((imageUrl, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImageFromCarousel(index)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Upload New Image */}
        <ImageUploader
          onImageUploaded={addImageToCarousel}
          currentImageUrl=""
          disabled={saving}
        />
        
        <Separator className="my-4" />
        
        {/* Add URL Input */}
        <div className="space-y-2">
          <Label htmlFor="newImageUrl" className="text-sm font-semibold text-gray-700">
            O agregar URL de imagen externa
          </Label>
          <div className="flex gap-2">
            <Input
              id="newImageUrl"
              placeholder="https://ejemplo.com/imagen-playa.jpg"
              className="bg-white border-gray-200 focus:border-blue-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImageUrl((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                const input = document.getElementById('newImageUrl') as HTMLInputElement;
                addImageUrl(input.value);
                input.value = '';
              }}
              disabled={saving}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Recomendado: Imágenes de playa que reflejen la belleza de Puerto López (tamaño: 1920x1080px)
          </p>
        </div>
        
        {backgroundImages.length > 1 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Carrusel activado:</strong> Las imágenes cambiarán automáticamente cada 5 segundos. 
              Los usuarios pueden navegar manualmente usando las flechas laterales.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default HeroEditForm;
