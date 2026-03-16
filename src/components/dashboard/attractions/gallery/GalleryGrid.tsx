
import { useState, useRef, useCallback } from 'react';
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
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchCurrentElement = useRef<HTMLElement | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
    toast({ title: 'Éxito', description: 'Archivo eliminado de la galería' });
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || 
           url.includes('video') || url.match(/\.(mp4|webm|mov)$/i);
  };

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onImagesUpdate(reordered);
    toast({ title: 'Orden actualizado', description: 'El orden de las imágenes ha sido cambiado' });
  }, [images, onImagesUpdate, toast]);

  // Desktop drag handlers
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
    if (dragIndex !== index) setOverIndex(index);
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
    reorderImages(dragIndex, dropIndex);
    handleDragEnd();
  };

  // Touch handlers for mobile
  const getIndexFromPoint = (x: number, y: number): number | null => {
    const container = containerRef.current;
    if (!container) return null;
    const children = Array.from(container.children) as HTMLElement[];
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return i;
      }
    }
    return null;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchCurrentElement.current = e.currentTarget;

    // Create ghost element
    const rect = e.currentTarget.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.style.position = 'fixed';
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.opacity = '0.85';
    ghost.style.borderRadius = '8px';
    ghost.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    ghost.style.transform = 'scale(1.05)';
    ghost.style.transition = 'transform 0.15s';
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.innerHTML = e.currentTarget.innerHTML;
    ghost.style.overflow = 'hidden';
    ghost.style.background = 'var(--background)';
    document.body.appendChild(ghost);
    ghostRef.current = ghost;

    setDragIndex(index);
  };

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (dragIndex === null || !ghostRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const ghost = ghostRef.current;
    const rect = touchCurrentElement.current?.getBoundingClientRect();
    if (rect) {
      ghost.style.left = `${touch.clientX - rect.width / 2}px`;
      ghost.style.top = `${touch.clientY - rect.height / 2}px`;
    }

    const targetIndex = getIndexFromPoint(touch.clientX, touch.clientY);
    if (targetIndex !== null && targetIndex !== dragIndex) {
      setOverIndex(targetIndex);
    }
  }, [dragIndex]);

  const handleTouchEnd = useCallback(() => {
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      reorderImages(dragIndex, overIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
    touchCurrentElement.current = null;
  }, [dragIndex, overIndex, reorderImages]);

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
        Arrastra las imágenes para cambiar su orden (compatible con táctil)
      </p>
      <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, index)}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative group cursor-grab active:cursor-grabbing rounded-lg transition-all duration-200 touch-none ${
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
            <div className="absolute top-1 left-1 md:opacity-0 md:group-hover:opacity-100 opacity-70 transition-opacity bg-black/50 rounded p-0.5">
              <GripVertical className="h-3 w-3 text-white" />
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 md:opacity-0 md:group-hover:opacity-100 opacity-70 transition-opacity h-6 w-6 p-0"
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
