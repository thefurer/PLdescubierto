
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import ImageUploader from '@/components/dashboard/ImageUploader';

interface HeroEditFormProps {
  formData: any;
  updateFormField: (field: string, value: string) => void;
  handleImageUpload: (imageUrl: string) => void;
  saving: boolean;
}

const HeroEditForm = ({ formData, updateFormField, handleImageUpload, saving }: HeroEditFormProps) => {
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
            placeholder="Título del hero (ej: Descubre la Magia de / Discover the Magic of)"
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
            placeholder="Subtítulo del hero (ej: Puerto López)"
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
          placeholder="Descripción del hero (aparecerá en ambos idiomas según la configuración)"
          rows={3}
          className="mt-2 bg-white border-gray-200 focus:border-blue-400"
        />
      </div>
      
      <Separator className="my-6" />
      
      {/* Image Upload Section */}
      <ImageUploader
        onImageUploaded={handleImageUpload}
        currentImageUrl={formData.backgroundImage}
        disabled={saving}
      />
      
      <Separator className="my-6" />
      
      <div className="space-y-2">
        <Label htmlFor="backgroundImage" className="text-sm font-semibold text-gray-700">
          O usar URL de imagen externa
        </Label>
        <Input
          id="backgroundImage"
          value={formData.backgroundImage || ''}
          onChange={(e) => updateFormField('backgroundImage', e.target.value)}
          placeholder="https://ejemplo.com/atardecer-playa.jpg"
          className="bg-white border-gray-200 focus:border-blue-400"
        />
        <p className="text-xs text-gray-500 mt-1">
          Recomendado: Una imagen de atardecer en playa que combine con los colores del sitio (tamaño: 1920x1080px)
        </p>
      </div>
    </>
  );
};

export default HeroEditForm;
