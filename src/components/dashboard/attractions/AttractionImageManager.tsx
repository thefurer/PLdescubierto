
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Link, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttractionImageManagerProps {
  currentImageUrl: string;
  attractionId: string;
  isUploading: boolean;
  onImageUpdate: (imageUrl: string) => void;
  onUploadImage: (file: File, attractionId: string) => Promise<string>;
}

const AttractionImageManager = ({
  currentImageUrl,
  attractionId,
  isUploading,
  onImageUpdate,
  onUploadImage
}: AttractionImageManagerProps) => {
  const { toast } = useToast();
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageManager, setShowImageManager] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setUploadStatus('uploading');
    try {
      console.log('Starting image upload for attraction:', attractionId);
      const imageUrl = await onUploadImage(file, attractionId);
      onImageUpdate(imageUrl);
      setShowImageManager(false);
      setUploadStatus('success');
      
      toast({
        title: 'Éxito',
        description: 'Imagen subida correctamente',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus('error');
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen. Inténtalo de nuevo.',
        variant: 'destructive'
      });
    }
    
    // Reset file input
    event.target.value = '';
  };

  const validateImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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

    if (!validateImageUrl(imageUrlInput.trim())) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa una URL válida',
        variant: 'destructive'
      });
      return;
    }

    onImageUpdate(imageUrlInput.trim());
    setImageUrlInput('');
    setShowImageManager(false);
    
    toast({
      title: 'Éxito',
      description: 'URL de imagen actualizada',
    });
  };

  const handleRemoveImage = () => {
    onImageUpdate('');
    setShowImageManager(false);
    
    toast({
      title: 'Éxito',
      description: 'Imagen eliminada',
    });
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Imagen
      </label>
      
      {currentImageUrl && (
        <div className="mb-3">
          <img 
            src={currentImageUrl} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded-lg border"
            onError={(e) => {
              console.error('Error loading image:', currentImageUrl);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowImageManager(!showImageManager)}
          className="flex-1"
          disabled={isUploading}
        >
          <Plus className="h-4 w-4 mr-2" />
          {currentImageUrl ? 'Cambiar Imagen' : 'Agregar Imagen'}
        </Button>
        
        {currentImageUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
            className="text-red-600 hover:text-red-700"
            disabled={isUploading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showImageManager && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Subir archivo local
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="text-sm"
            />
            
            {isUploading && (
              <div className="flex items-center mt-2 text-blue-600 text-xs">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                Subiendo imagen...
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="flex items-center mt-2 text-green-600 text-xs">
                <CheckCircle className="h-3 w-3 mr-2" />
                Imagen subida exitosamente
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="flex items-center mt-2 text-red-600 text-xs">
                <AlertCircle className="h-3 w-3 mr-2" />
                Error al subir la imagen
              </div>
            )}
          </div>

          <Separator />

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              URL de imagen
            </label>
            <div className="flex gap-2">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="text-sm"
                disabled={isUploading}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleUrlSubmit}
                disabled={!imageUrlInput.trim() || isUploading}
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionImageManager;
