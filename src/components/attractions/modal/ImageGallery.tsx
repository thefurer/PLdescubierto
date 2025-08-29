
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  attractionName: string;
}

interface FullscreenModalProps {
  isOpen: boolean;
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

const FullscreenModal = ({ isOpen, imageUrl, altText, onClose }: FullscreenModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Cerrar imagen en pantalla completa"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const ImageGallery = ({ images, attractionName }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; alt: string } | null>(null);

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

  // Function to get circle classes with decreasing sizes
  const getCircleClasses = (index: number) => {
    const isActive = index === currentImageIndex;
    
    return `rounded-full transition-all duration-300 ${
      isActive 
        ? 'bg-white scale-125' 
        : 'bg-white/50 hover:bg-white/70'
    }`;
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || 
           url.includes('video') || url.match(/\.(mp4|webm|mov)$/i);
  };

  if (images.length === 0) {
    console.log('No images to display');
    return null;
  }

  console.log('Displaying image', currentImageIndex, 'of', images.length, ':', images[currentImageIndex]);

  const openFullscreen = (imageUrl: string, altText: string) => {
    setFullscreenImage({ url: imageUrl, alt: altText });
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <>
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg bg-gray-100">
      {isVideo(images[currentImageIndex]) ? (
        <video
          src={images[currentImageIndex]}
          className="w-full h-full object-cover transition-all duration-500"
          controls
          muted
          autoPlay
          loop
          onError={() => {
            console.log('Error loading video:', images[currentImageIndex]);
          }}
          onLoadedData={() => {
            console.log('Successfully loaded video:', images[currentImageIndex]);
          }}
        />
      ) : (
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
      )}

      {/* Expand icon - always visible for images */}
      {!isVideo(images[currentImageIndex]) && (
        <button
          onClick={() => openFullscreen(images[currentImageIndex], `${attractionName} - Imagen ${currentImageIndex + 1}`)}
          className="absolute top-3 left-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white z-10"
          aria-label="Ver imagen en pantalla completa"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      )}
      
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
                  width: `${Math.max(12 - (index * 1), 6)}px`,
                  height: `${Math.max(12 - (index * 1), 6)}px`
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

      <FullscreenModal
        isOpen={fullscreenImage !== null}
        imageUrl={fullscreenImage?.url || ''}
        altText={fullscreenImage?.alt || ''}
        onClose={closeFullscreen}
      />
    </>
  );
};
