
import { Button } from '@/components/ui/button';
import { Trash2, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryGridProps {
  images: string[];
  maxImages: number;
  onImagesUpdate: (images: string[]) => void;
}

const GalleryGrid = ({ images, maxImages, onImagesUpdate }: GalleryGridProps) => {
  const { toast } = useToast();

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
    
    toast({
      title: 'Éxito',
      description: 'Imagen eliminada de la galería',
    });
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No hay imágenes en la galería</p>
        <p className="text-sm">Agrega hasta {maxImages} imágenes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Galería ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => removeImage(index)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {images.length >= maxImages && (
        <p className="text-sm text-amber-600 text-center">
          Has alcanzado el límite máximo de {maxImages} imágenes
        </p>
      )}
    </div>
  );
};

export default GalleryGrid;
