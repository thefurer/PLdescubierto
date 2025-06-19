
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Users, Star, ChevronLeft, ChevronRight, Calendar, History } from 'lucide-react';
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

  // Auto-advance images every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, attraction?.id]);

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
  
  // Get schedules from database or use default
  const schedules = additionalInfo.schedules || [
    { day: 'Lunes - Viernes', openTime: '8:00', closeTime: '18:00', isClosed: false },
    { day: 'Sábados', openTime: '9:00', closeTime: '20:00', isClosed: false },
    { day: 'Domingos', openTime: '10:00', closeTime: '17:00', isClosed: false }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-ocean-dark">
            {attraction.name}
          </DialogTitle>
        </DialogHeader>

        {/* Image Gallery with Auto-advance */}
        {images.length > 0 && (
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
            <img
              src={images[currentImageIndex]}
              alt={attraction.name}
              className="w-full h-full object-cover transition-opacity duration-500"
              key={currentImageIndex}
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

        {/* Tabs for organized content */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Descripción
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Actividades
            </TabsTrigger>
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Horarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Historia y Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {attraction.description || 'Sin descripción disponible.'}
              </p>
            </div>

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
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Actividades Disponibles</h3>
              {activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-primary rounded-full mr-3"></div>
                      <span className="font-medium">{activity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay actividades específicas registradas para esta atracción.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Horarios de Atención</h3>
              <div className="space-y-3">
                {schedules.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{schedule.day}</span>
                    {schedule.isClosed ? (
                      <span className="text-red-500 font-semibold">Cerrado</span>
                    ) : (
                      <span className="text-green-primary font-semibold">
                        {schedule.openTime} - {schedule.closeTime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Los horarios pueden variar según la temporada. Se recomienda confirmar antes de su visita.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
