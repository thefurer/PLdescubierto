
import { useState } from "react";
import { MapPin, Star } from "lucide-react";
import { TouristAttraction } from "@/types/touristAttractions";
import { AttractionModal } from "./AttractionModal";

interface AttractionCardProps {
  attraction: TouristAttraction;
  index: number;
}

const categoryLabels = {
  todo: "Todo",
  playa: "Playa",
  cultura: "Cultura",
  naturaleza: "Naturaleza"
};

const defaultImages = {
  playa: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80",
  cultura: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80",
  naturaleza: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80"
};

export const AttractionCard = ({
  attraction,
  index
}: AttractionCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setModalOpen(true);
    }
  };

  // Usar la primera imagen de la galería o la imagen principal
  const displayImage = attraction.gallery_images && attraction.gallery_images.length > 0 
    ? attraction.gallery_images[0] 
    : attraction.image_url || defaultImages[attraction.category as keyof typeof defaultImages] || defaultImages.naturaleza;

  return (
    <>
      <div 
        className="group card-enhanced overflow-hidden cursor-pointer transform hover:-translate-y-2 smooth-transition animate-fade-in"
        style={{
          animationDelay: `${index * 100}ms`
        }}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Ver detalles de ${attraction.name}`}
      >
        <div className="relative h-56 overflow-hidden">
          <img 
            src={displayImage} 
            alt={attraction.name}
            className="w-full h-full object-cover image-hover-scale image-hover-brightness"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent group-hover:from-black/40 smooth-transition"></div>
          
          {/* Rating badge */}
          <div className="absolute top-4 right-4 glass-card rounded-full px-3 py-2 flex items-center backdrop-blur-md">
            <Star 
              size={16} 
              className="text-amber-400 mr-1 fill-current" 
              aria-label="Calificación 5 estrellas"
            />
            <span className="text-sm font-semibold text-white">5.0</span>
          </div>
          
          {/* Category badge */}
          <div className="absolute bottom-4 left-4 bg-green-primary/90 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium capitalize shadow-lg">
            {categoryLabels[attraction.category as keyof typeof categoryLabels]}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-semibold text-ocean-dark group-hover:text-green-primary smooth-transition leading-tight">
            {attraction.name}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {attraction.description}
          </p>
          
          <div className="flex items-center text-ocean pt-2">
            <MapPin 
              size={18} 
              className="mr-3 text-green-primary flex-shrink-0" 
              aria-label="Ubicación"
            />
            <span className="text-sm font-medium">Puerto López, Ecuador</span>
          </div>
        </div>
      </div>

      <AttractionModal 
        attraction={attraction} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
};
