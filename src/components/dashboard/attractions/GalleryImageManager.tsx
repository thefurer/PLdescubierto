
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Upload, Link, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GalleryImageManagerProps {
  attractionId: string;
  currentImages: string[];
  isUploading: boolean;
  onImagesUpdate: (images: string[]) => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const GalleryImageManager = ({
  attractionId,
  currentImages,
  isUploading,
  onImagesUpdate,
  onUploadImage
}: GalleryImageManagerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const MAX_IMAGES = 5;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (currentImages.length >= MAX_IMAGES) {
      toast({
        title: 'Límite alcanzado',
        description: `Solo puedes tener máximo ${MAX_IMAGES} imágenes en la galería`,
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
      setIsDialogOpen(false);
      
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

    if (currentImages.length >= MAX_IMAGES) {
      toast({
        title: 'Límite alcanzado',
        description: `Solo puedes tener máximo ${MAX_IMAGES} imágenes en la galería`,
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
    setIsDialogOpen(false);
    
    toast({
      title: 'Éxito',
      description: 'Imagen agregada a la galería',
    });
  };

  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesUpdate(newImages);
    
    toast({
      title: 'Éxito',
      description: 'Imagen eliminada de la galería',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Galería de Imágenes ({currentImages.length}/{MAX_IMAGES})
          </div>
          {currentImages.length < MAX_IMAGES && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen
                </Button>
              </DialogTrigger>
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
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentImages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay imágenes en la galería</p>
            <p className="text-sm">Agrega hasta {MAX_IMAGES} imágenes</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentImages.map((image, index) => (
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
        )}
        
        {currentImages.length >= MAX_IMAGES && (
          <p className="text-sm text-amber-600 mt-2 text-center">
            Has alcanzado el límite máximo de {MAX_IMAGES} imágenes
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GalleryImageManager;
