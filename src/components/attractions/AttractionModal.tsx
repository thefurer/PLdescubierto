
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { TouristAttraction } from '@/types/touristAttractions';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!attraction) return null;

  // Usar gallery_images si existe, sino usar image_url como fallback
  const images = attraction.gallery_images && attraction.gallery_images.length > 0 
    ? attraction.gallery_images 
    : attraction.image_url ? [attraction.image_url] : [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const activities = attraction.activities || [];
  const additionalInfo = attraction.additional_info || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ocean-dark">
            {attraction.name}
          </DialogTitle>
        </DialogHeader>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
            <img
              src={images[currentImageIndex]}
              alt={attraction.name}
              className="w-full h-full object-cover"
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
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

        {/* Description */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">
              {attraction.description || 'Sin descripción disponible.'}
            </p>
          </div>

          {/* Activities */}
          {activities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Actividades</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-primary rounded-full mr-2"></div>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {Object.keys(additionalInfo).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalInfo.duration && (
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-green-primary" />
                    <span>Duración: {additionalInfo.duration}</span>
                  </div>
                )}
                {additionalInfo.capacity && (
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-green-primary" />
                    <span>Capacidad: {additionalInfo.capacity}</span>
                  </div>
                )}
                {additionalInfo.price && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium">Precio: {additionalInfo.price}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-green-primary" />
            <span>Puerto López, Ecuador</span>
          </div>
        </div>

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
