
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
        description: `Solo puedes tener máximo ${maxImages} imágenes en la galería`,
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un archivo de imagen válido',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen debe ser menor a 5MB',
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
        description: 'Imagen agregada a la galería',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen. Inténtalo de nuevo.',
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
        description: `Solo puedes tener máximo ${maxImages} imágenes en la galería`,
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
      description: 'Imagen agregada a la galería',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Imagen a la Galería</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Subir archivo local
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {isUploading && (
              <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">O</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              URL de imagen
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
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
