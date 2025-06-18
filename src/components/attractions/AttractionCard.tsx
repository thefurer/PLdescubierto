
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

export const AttractionCard = ({ attraction, index }: AttractionCardProps) => {
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
        className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl smooth-transition transform hover:-translate-y-2 cursor-pointer"
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={handleCardClick}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={displayImage}
            alt={attraction.name}
            className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30"></div>
          <div className="absolute top-3 right-3 glass-card rounded-full px-3 py-1 flex items-center">
            <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
            <span className="text-sm font-semibold text-white">4.8</span>
          </div>
          <div className="absolute bottom-3 left-3 bg-green-primary/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium capitalize">
            {categoryLabels[attraction.category as keyof typeof categoryLabels]}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-ocean-dark mb-3 group-hover:text-green-primary smooth-transition">
            {attraction.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
            {attraction.description}
          </p>
          <div className="flex items-center text-ocean">
            <MapPin size={16} className="mr-2 text-green-primary" />
            <span className="text-sm font-medium">Puerto López</span>
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
