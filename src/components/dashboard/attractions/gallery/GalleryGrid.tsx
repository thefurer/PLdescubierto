
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Image, Play, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryGridProps {
  images: string[];
  maxImages: number;
  onImagesUpdate: (images: string[]) => void;
}

const GalleryGrid = ({ images, maxImages, onImagesUpdate }: GalleryGridProps) => {
  const { toast } = useToast();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
    toast({ title: 'Éxito', description: 'Archivo eliminado de la galería' });
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || 
           url.includes('video') || url.match(/\.(mp4|webm|mov)$/i);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDragIndex(index);
    dragNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = '0.4';
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex !== index) {
      setOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    setDragIndex(null);
    setOverIndex(null);
    dragNode.current = null;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    onImagesUpdate(reordered);
    toast({ title: 'Orden actualizado', description: 'El orden de las imágenes ha sido cambiado' });
    handleDragEnd();
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Image className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>No hay archivos en la galería</p>
        <p className="text-sm">Agrega hasta {maxImages} imágenes y videos</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground text-center">
        Arrastra las imágenes para cambiar su orden
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
            className={`relative group cursor-grab active:cursor-grabbing rounded-lg transition-all duration-200 ${
              overIndex === index && dragIndex !== index
                ? 'ring-2 ring-primary ring-offset-2 scale-105'
                : ''
            } ${dragIndex === index ? 'opacity-40' : ''}`}
          >
            {isVideo(image) ? (
              <div className="relative w-full h-24 bg-muted rounded-lg border overflow-hidden">
                <video
                  src={image}
                  className="w-full h-full object-cover pointer-events-none"
                  muted
                  onError={(e) => {
                    (e.target as HTMLVideoElement).style.display = 'none';
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
                className="w-full h-24 object-cover rounded-lg border pointer-events-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded p-0.5">
              <GripVertical className="h-3 w-3 text-white" />
            </div>
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
