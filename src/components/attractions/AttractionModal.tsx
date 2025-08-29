
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TouristAttraction } from '@/types/touristAttractions';
import { ImageGallery } from './modal/ImageGallery';
import { AttractionTabs } from './modal/AttractionTabs';
import { CompactAttractionRating } from './modal/CompactAttractionRating';

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-3 sm:p-6 w-[95vw] sm:w-full">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-ocean-dark leading-tight">
            {attraction.name}
          </DialogTitle>
        </DialogHeader>

        {/* Image Gallery with auto-advance */}
        {images.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <ImageGallery images={images} attractionName={attraction.name} />
          </div>
        )}

        {/* Category and Rating */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Badge variant="outline" className="capitalize text-xs sm:text-sm">
            {categoryLabels[attraction.category as keyof typeof categoryLabels]}
          </Badge>
          <CompactAttractionRating attraction={attraction} />
        </div>

        {/* Tabs for organized content */}
        <AttractionTabs attraction={attraction} />
      </DialogContent>
    </Dialog>
  );
};
