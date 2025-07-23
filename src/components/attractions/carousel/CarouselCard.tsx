
import { MapPin } from "lucide-react";
import { TouristAttraction } from "@/types/touristAttractions";

interface CarouselCardProps {
  attraction: TouristAttraction;
  index: number;
  currentIndex: number;
  onClick: (attraction: TouristAttraction, index: number) => void;
}

const defaultImages = {
  playa: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80",
  cultura: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80",
  naturaleza: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80"
};

export const CarouselCard = ({ attraction, index, currentIndex, onClick }: CarouselCardProps) => {
  const isCentered = index === currentIndex;
  const displayImage = attraction.gallery_images && attraction.gallery_images.length > 0 
    ? attraction.gallery_images[0] 
    : attraction.image_url || defaultImages[attraction.category as keyof typeof defaultImages] || defaultImages.naturaleza;

  return (
    <div
      key={attraction.id}
      className={`group flex-shrink-0 cursor-pointer smooth-transition ${
        isCentered 
          ? 'w-96 scale-105 z-10' 
          : 'w-80 scale-100'
      }`}
      onClick={() => onClick(attraction, index)}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl smooth-transition h-[480px] border border-gray-200/50">
        <div className="relative h-full overflow-hidden rounded-2xl">
          <img 
            src={displayImage} 
            alt={attraction.name}
            className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-700"
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

          {/* Attraction name positioned at bottom - always visible */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
              {attraction.name}
            </h3>
            
            {/* Location indicator */}
            <div className="flex items-center text-white/90 opacity-0 group-hover:opacity-100 smooth-transition duration-300">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm font-medium">Puerto López, Ecuador</span>
            </div>
          </div>

          {/* Hover overlay with description */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 smooth-transition duration-300 flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                {attraction.name}
              </h3>
              <p className="text-gray-200 text-sm mb-4 line-clamp-4 leading-relaxed">
                {attraction.description}
              </p>
              
              <div className="inline-flex items-center text-green-300 bg-green-500/20 px-4 py-2 rounded-full">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm font-medium">Explorar detalles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
