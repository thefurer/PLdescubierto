
import { Button } from '@/components/ui/button';
import { Trash2, Image, Play } from 'lucide-react';
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
      description: 'Archivo eliminado de la galería',
    });
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || 
           url.includes('video') || url.match(/\.(mp4|webm|mov)$/i);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No hay archivos en la galería</p>
        <p className="text-sm">Agrega hasta {maxImages} imágenes y videos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            {isVideo(image) ? (
              <div className="relative w-full h-24 bg-gray-100 rounded-lg border overflow-hidden">
                <video
                  src={image}
                  className="w-full h-full object-cover"
                  muted
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            ) : (
              <img
                src={image}
                alt={`Galería ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
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
          Has alcanzado el límite máximo de {maxImages} archivos
        </p>
      )}
    </div>
  );
};

export default GalleryGrid;
