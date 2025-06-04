
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@/data/galleryData";

type GalleryLightboxProps = {
  isOpen: boolean;
  currentImageIndex: number;
  images: GalleryImage[];
  onClose: () => void;
  onNavigate: (direction: "next" | "prev") => void;
  onImageSelect: (index: number) => void;
};

const GalleryLightbox = ({ 
  isOpen, 
  currentImageIndex, 
  images, 
  onClose, 
  onNavigate, 
  onImageSelect 
}: GalleryLightboxProps) => {
  if (!isOpen) return null;

  const currentImage = images[currentImageIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
      <button 
        className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
        onClick={onClose}
      >
        <X size={32} />
      </button>
      
      <button 
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
        onClick={() => onNavigate("prev")}
      >
        <ChevronLeft size={48} />
      </button>
      
      <button 
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
        onClick={() => onNavigate("next")}
      >
        <ChevronRight size={48} />
      </button>
      
      <div className="relative max-w-5xl max-h-[80vh]">
        <img 
          src={currentImage.src} 
          alt={currentImage.alt} 
          className="max-h-[80vh] max-w-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
          <p className="font-medium">{currentImage.alt}</p>
          <p className="text-sm text-gray-300">{currentImage.category}</p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button 
            key={index}
            className={cn(
              "w-3 h-3 rounded-full",
              index === currentImageIndex ? "bg-white" : "bg-gray-500 hover:bg-gray-400"
            )}
            onClick={() => onImageSelect(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryLightbox;
