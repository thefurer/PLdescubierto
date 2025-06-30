
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
          ? 'w-80 scale-110 z-10' 
          : 'w-72 scale-95 opacity-60 blur-[1px]'
      }`}
      onClick={() => onClick(attraction, index)}
    >
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl smooth-transition h-[420px] border border-white/20">
        <div className="relative h-full overflow-hidden rounded-3xl">
          <img 
            src={displayImage} 
            alt={attraction.name}
            className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-700"
          />
          
          {/* Enhanced overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 opacity-70 group-hover:opacity-85 smooth-transition"></div>
          
          {/* Transparent text at top */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center">
            <span className="text-white/60 text-xs font-medium tracking-wide">
              Haz click para explorar
            </span>
          </div>

          {/* Attraction name positioned at bottom center - hidden on hover */}
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center group-hover:opacity-0 smooth-transition">
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg px-4">
              {attraction.name}
            </h3>
          </div>

          {/* Animated call-to-action text for centered card */}
          {isCentered && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-pulse group-hover:opacity-0 smooth-transition">
              <div className="bg-green-500/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30 shadow-lg">
                <span className="text-white text-sm font-bold">✨ ¡Haz clic para explorar! ✨</span>
              </div>
            </div>
          )}

          {/* Enhanced sliding information overlay */}
          <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 smooth-transition duration-500 ease-out">
            <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent p-8 pt-16 rounded-b-3xl">
              <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight">
                {attraction.name}
              </h3>
              <p className="text-gray-200 text-sm mb-6 line-clamp-4 leading-relaxed">
                {attraction.description}
              </p>
              
              <div className="flex items-center justify-center">
                <div className="flex items-center text-green-300">
                  <MapPin size={16} className="mr-2" />
                  <span className="text-sm font-medium">Descubrir más detalles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
