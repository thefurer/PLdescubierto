
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Link, Trash2 } from 'lucide-react';

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
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showImageManager, setShowImageManager] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await onUploadImage(file, attractionId);
      onImageUpdate(imageUrl);
      setShowImageManager(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      onImageUpdate(imageUrlInput.trim());
      setImageUrlInput('');
      setShowImageManager(false);
    }
  };

  const handleRemoveImage = () => {
    onImageUpdate('');
    setShowImageManager(false);
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
              <p className="text-xs text-blue-600 mt-1">Subiendo imagen...</p>
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
              />
              <Button
                type="button"
                size="sm"
                onClick={handleUrlSubmit}
                disabled={!imageUrlInput.trim()}
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
