
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attractionId: string;
  currentImages: string[];
  maxImages: number;
  isUploading: boolean;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
  onImagesUpdate: (images: string[]) => void;
}

const ImageUploadDialog = ({
  isOpen,
  onClose,
  attractionId,
  currentImages,
  maxImages,
  isUploading,
  onUploadImage,
  onImagesUpdate
}: ImageUploadDialogProps) => {
  const { toast } = useToast();
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (currentImages.length >= maxImages) {
      toast({
        title: 'Límite alcanzado',
        description: `Solo puedes tener máximo ${maxImages} archivos en la galería`,
        variant: 'destructive'
      });
      return;
    }

    // Validate file type (images and short videos)
    const validTypes = ['image/', 'video/mp4', 'video/webm', 'video/mov'];
    const isValidType = validTypes.some(type => file.type.startsWith(type));
    
    if (!isValidType) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una imagen o video válido (MP4, WebM, MOV)',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 15MB for videos, 5MB for images)
    const maxSize = file.type.startsWith('video/') ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: 'Error',
        description: `El archivo debe ser menor a ${file.type.startsWith('video/') ? '15MB' : '5MB'}`,
        variant: 'destructive'
      });
      return;
    }

    try {
      const imageUrl = await onUploadImage(file, attractionId);
      const newImages = [...currentImages, imageUrl];
      onImagesUpdate(newImages);
      onClose();
      
      toast({
        title: 'Éxito',
        description: 'Archivo agregado a la galería',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir el archivo. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    }
    
    // Reset file input
    event.target.value = '';
  };

  const handleUrlSubmit = () => {
    if (!imageUrlInput.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa una URL válida',
        variant: 'destructive'
      });
      return;
    }

    if (currentImages.length >= maxImages) {
      toast({
        title: 'Límite alcanzado',
        description: `Solo puedes tener máximo ${maxImages} archivos en la galería`,
        variant: 'destructive'
      });
      return;
    }

    try {
      new URL(imageUrlInput.trim());
    } catch {
      toast({
        title: 'Error',
        description: 'Por favor ingresa una URL válida',
        variant: 'destructive'
      });
      return;
    }

    const newImages = [...currentImages, imageUrlInput.trim()];
    onImagesUpdate(newImages);
    setImageUrlInput('');
    onClose();
    
    toast({
      title: 'Éxito',
      description: 'Archivo agregado a la galería',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Imagen o Video a la Galería</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Subir archivo local (Imágenes o videos cortos)
            </label>
            <Input
              type="file"
              accept="image/*,video/mp4,video/webm,video/mov"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Imágenes: máx. 5MB | Videos: máx. 15MB (MP4, WebM, MOV)
            </p>
            {isUploading && (
              <p className="text-sm text-blue-600 mt-2">Subiendo archivo...</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">O</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              URL de imagen o video
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://ejemplo.com/archivo.jpg"
                disabled={isUploading}
              />
              <Button
                onClick={handleUrlSubmit}
                disabled={!imageUrlInput.trim() || isUploading}
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
