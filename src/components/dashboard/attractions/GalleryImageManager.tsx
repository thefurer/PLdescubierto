
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Image } from 'lucide-react';
import ImageUploadDialog from './gallery/ImageUploadDialog';
import GalleryGrid from './gallery/GalleryGrid';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const MAX_IMAGES = 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Galería de Imágenes ({currentImages.length}/{MAX_IMAGES})
          </div>
          {currentImages.length < MAX_IMAGES && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Imagen
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <GalleryGrid
          images={currentImages}
          maxImages={MAX_IMAGES}
          onImagesUpdate={onImagesUpdate}
        />
        
        <ImageUploadDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          attractionId={attractionId}
          currentImages={currentImages}
          maxImages={MAX_IMAGES}
          isUploading={isUploading}
          onUploadImage={onUploadImage}
          onImagesUpdate={onImagesUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default GalleryImageManager;
