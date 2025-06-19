
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  attractionName: string;
}

export const ImageGallery = ({ images, attractionName }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance images every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Reset image index when images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

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

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg">
      <img
        src={images[currentImageIndex]}
        alt={attractionName}
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
  );
};
