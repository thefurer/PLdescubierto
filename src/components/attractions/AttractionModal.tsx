
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';
import { ImageGallery } from './modal/ImageGallery';
import { AttractionTabs } from './modal/AttractionTabs';

interface AttractionModalProps {
  attraction: TouristAttraction | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels = {
  todo: "Todo",
  playa: "Playa", 
  cultura: "Cultura",
  naturaleza: "Naturaleza"
};

export const AttractionModal = ({ attraction, isOpen, onClose }: AttractionModalProps) => {
  if (!attraction) return null;

  // Crear array de imágenes: primero gallery_images, luego image_url si no hay galería
  let images: string[] = [];
  
  // Si hay gallery_images, usar esas
  if (attraction.gallery_images && attraction.gallery_images.length > 0) {
    images = [...attraction.gallery_images];
  }
  
  // Si no hay gallery_images pero sí image_url, usar image_url
  if (images.length === 0 && attraction.image_url) {
    images = [attraction.image_url];
  }

  console.log('Attraction:', attraction.name);
  console.log('Gallery images:', attraction.gallery_images);
  console.log('Image URL:', attraction.image_url);
  console.log('Final images array:', images);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ocean-dark">
            {attraction.name}
          </DialogTitle>
        </DialogHeader>

        {/* Image Gallery with auto-advance */}
        {images.length > 0 && (
          <ImageGallery images={images} attractionName={attraction.name} />
        )}

        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {categoryLabels[attraction.category as keyof typeof categoryLabels]}
          </Badge>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-current" />
            <span className="ml-1 text-sm font-medium">4.8</span>
          </div>
        </div>

        {/* Tabs for organized content */}
        <AttractionTabs attraction={attraction} />

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} className="bg-green-primary hover:bg-green-600">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
