import { useState, useEffect } from 'react';

interface UseImagePreloaderProps {
  images: string[];
  preloadCount?: number;
}

export const useImagePreloader = ({ images, preloadCount = 3 }: UseImagePreloaderProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!images.length) {
      setIsLoading(false);
      return;
    }

    const preloadImages = async () => {
      const imagesToPreload = images.slice(0, Math.min(preloadCount, images.length));
      
      try {
        const preloadPromises = imagesToPreload.map((src) => {
          return new Promise<string>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
          });
        });

        const preloadedImages = await Promise.allSettled(preloadPromises);
        const successfullyLoaded = preloadedImages
          .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
          .map(result => result.value);

        setLoadedImages(new Set(successfullyLoaded));
        
        // Preload remaining images in background
        if (images.length > preloadCount) {
          images.slice(preloadCount).forEach((src) => {
            const img = new Image();
            img.onload = () => {
              setLoadedImages(prev => new Set([...prev, src]));
            };
            img.src = src;
          });
        }
      } catch (error) {
        console.error('Error preloading images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [images, preloadCount]);

  return {
    loadedImages,
    isLoading,
    isImageLoaded: (src: string) => loadedImages.has(src)
  };
};