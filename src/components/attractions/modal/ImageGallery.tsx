
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  attractionName: string;
}

export const ImageGallery = ({ images, attractionName }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log('ImageGallery received images:', images);
  console.log('Images length:', images.length);

  // Auto-advance images every 3 seconds when there are multiple images
  useEffect(() => {
    if (images.length <= 1) {
      console.log('Not starting auto-advance: only', images.length, 'image(s)');
      return;
    }

    console.log('Starting auto-advance for', images.length, 'images');
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const next = (prev + 1) % images.length;
        console.log('Auto-advancing from image', prev, 'to', next);
        return next;
      });
    }, 3000);

    return () => {
      console.log('Cleaning up auto-advance interval');
      clearInterval(interval);
    };
  }, [images.length]);

  // Reset image index when images change
  useEffect(() => {
    console.log('Images changed, resetting to index 0');
    setCurrentImageIndex(0);
  }, [images]);

  const nextImage = () => {
    if (images.length > 1) {
      const next = (currentImageIndex + 1) % images.length;
      console.log('Manual next: going from', currentImageIndex, 'to', next);
      setCurrentImageIndex(next);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      const prev = (currentImageIndex - 1 + images.length) % images.length;
      console.log('Manual prev: going from', currentImageIndex, 'to', prev);
      setCurrentImageIndex(prev);
    }
  };

  // Function to get circle size based on index
  const getCircleSize = (index: number) => {
    const baseSize = 3; // Base size in rem (w-3 h-3)
    const decreaseRate = 0.3; // How much to decrease per index
    const minSize = 1.5; // Minimum size
    
    const size = Math.max(baseSize - (index * decreaseRate), minSize);
    return `w-${Math.round(size)} h-${Math.round(size)}`;
  };

  // Function to get circle classes with decreasing sizes
  const getCircleClasses = (index: number) => {
    const isActive = index === currentImageIndex;
    const sizeClasses = getCircleSize(index);
    
    return `${sizeClasses} rounded-full transition-all duration-300 ${
      isActive 
        ? 'bg-white scale-125' 
        : 'bg-white/50 hover:bg-white/70'
    }`;
  };

  if (images.length === 0) {
    console.log('No images to display');
    return null;
  }

  console.log('Displaying image', currentImageIndex, 'of', images.length, ':', images[currentImageIndex]);

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gray-100">
      <img
        src={images[currentImageIndex]}
        alt={`${attractionName} - Imagen ${currentImageIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
        onError={(e) => {
          console.log('Error loading image:', images[currentImageIndex]);
        }}
        onLoad={() => {
          console.log('Successfully loaded image:', images[currentImageIndex]);
        }}
      />
      
      {/* Navigation arrows - show when there are multiple images */}
      {images.length > 1 && (
        <>
          {/* Left arrow */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white transition-all duration-200 shadow-lg z-10"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Right arrow */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white transition-all duration-200 shadow-lg z-10"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Image indicators with decreasing sizes */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                className={getCircleClasses(index)}
                onClick={() => {
                  console.log('Indicator clicked: going to image', index);
                  setCurrentImageIndex(index);
                }}
                style={{
                  width: `${Math.max(12 - (index * 2), 8)}px`,
                  height: `${Math.max(12 - (index * 2), 8)}px`
                }}
              />
            ))}
          </div>
          
          {/* Image counter */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};
