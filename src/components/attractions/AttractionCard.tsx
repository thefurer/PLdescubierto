
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

  // Usar la primera imagen de la galería o la imagen principal
  const displayImage = attraction.gallery_images && attraction.gallery_images.length > 0 
    ? attraction.gallery_images[0] 
    : attraction.image_url || defaultImages[attraction.category as keyof typeof defaultImages] || defaultImages.naturaleza;

  return (
    <>
      <div 
        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl smooth-transition transform hover:-translate-y-2 cursor-pointer" 
        style={{ animationDelay: `${index * 100}ms` }} 
        onClick={handleCardClick}
      >
        <div className="relative h-80 overflow-hidden">
          <img 
            src={displayImage} 
            alt={attraction.name} 
            className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-700" 
          />
          
          {/* Overlay gradient that becomes more visible on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 smooth-transition"></div>
          
          {/* Rating badge */}
          <div className="absolute top-4 right-4 glass-card rounded-full px-3 py-1.5 flex items-center transform translate-y-0 group-hover:-translate-y-1 smooth-transition">
            <Star size={14} className="text-amber-400 mr-1" fill="currentColor" />
            <span className="text-sm font-semibold text-white">5.0</span>
          </div>
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 bg-green-primary/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs font-medium capitalize transform translate-y-0 group-hover:-translate-y-1 smooth-transition">
            {categoryLabels[attraction.category as keyof typeof categoryLabels]}
          </div>

          {/* Sliding information overlay - slides up from bottom on hover */}
          <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 smooth-transition duration-500 ease-out">
            <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12">
              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                {attraction.name}
              </h3>
              <p className="text-gray-200 text-sm mb-4 line-clamp-3 leading-relaxed">
                {attraction.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-300">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm font-medium">Explorar detalles</span>
                </div>
                <div className="text-xs text-green-300 font-semibold bg-green-500/20 px-3 py-1 rounded-full">
                  ¡Descubrir!
                </div>
              </div>
            </div>
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
