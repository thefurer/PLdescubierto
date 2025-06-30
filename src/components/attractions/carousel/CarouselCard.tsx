
import { MapPin, Star } from "lucide-react";
import { TouristAttraction } from "@/types/touristAttractions";

interface CarouselCardProps {
  attraction: TouristAttraction;
  index: number;
  currentIndex: number;
  onClick: (attraction: TouristAttraction, index: number) => void;
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
          ? 'w-80 scale-110 z-10' 
          : 'w-72 scale-95 opacity-60 blur-[1px]'
      }`}
      onClick={() => onClick(attraction, index)}
    >
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl smooth-transition h-80">
        <div className="relative h-full overflow-hidden rounded-3xl">
          <img 
            src={displayImage} 
            alt={attraction.name}
            className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-700"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 smooth-transition"></div>
          
          {/* Rating */}
          <div className="absolute top-4 right-4 glass-card rounded-full px-3 py-1.5 flex items-center transform translate-y-0 group-hover:-translate-y-1 smooth-transition">
            <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
            <span className="text-sm font-semibold text-white">5.0</span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-green-primary/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs font-medium capitalize transform translate-y-0 group-hover:-translate-y-1 smooth-transition">
            {categoryLabels[attraction.category as keyof typeof categoryLabels]}
          </div>

          {/* Sliding information overlay */}
          <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 smooth-transition duration-500 ease-out">
            <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-12 rounded-b-3xl">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {attraction.name}
              </h3>
              <p className="text-gray-200 text-sm mb-4 line-clamp-3 leading-relaxed">
                {attraction.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-300">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-xs font-medium">Descubrir más</span>
                </div>
                {isCentered && (
                  <div className="text-xs text-green-300 font-semibold bg-green-500/20 px-3 py-1 rounded-full">
                    ¡Clic aquí!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
