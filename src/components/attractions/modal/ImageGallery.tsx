
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
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gray-100">
      <img
        src={images[currentImageIndex]}
        alt={`${attractionName} - Imagen ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
        onError={(e) => {
          console.log('Error loading image:', images[currentImageIndex]);
        }}
      />
      
      {/* Navigation arrows - show when there are multiple images */}
      {images.length > 1 && (
        <>
          {/* Left arrow - only show if not on first image or if we want to show it always */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Right arrow - always visible when there are multiple images */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
          
          {/* Image counter */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};
