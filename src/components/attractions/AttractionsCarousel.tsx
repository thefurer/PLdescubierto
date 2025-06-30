
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { TouristAttraction } from "@/types/touristAttractions";
import { AttractionModal } from "./AttractionModal";

interface AttractionsCarouselProps {
  attractions: TouristAttraction[];
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

export const AttractionsCarousel = ({ attractions }: AttractionsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with third item centered
  const [selectedAttraction, setSelectedAttraction] = useState<TouristAttraction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 300; // Width of each card
      const gap = 24; // Gap between cards
      const scrollPosition = index * (cardWidth + gap) - (carouselRef.current.clientWidth / 2) + (cardWidth / 2);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : attractions.length - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < attractions.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleCardClick = (attraction: TouristAttraction, index: number) => {
    if (index === currentIndex) {
      setSelectedAttraction(attraction);
      setModalOpen(true);
    } else {
      setCurrentIndex(index);
      scrollToIndex(index);
    }
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
  }, []);

  return (
    <div className="relative py-12">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 glass-card p-3 rounded-full hover:bg-white/20 smooth-transition"
        aria-label="Anterior atracción"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 glass-card p-3 rounded-full hover:bg-white/20 smooth-transition"
        aria-label="Siguiente atracción"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {attractions.map((attraction, index) => {
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
              onClick={() => handleCardClick(attraction, index)}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl smooth-transition h-96">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={displayImage} 
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-700"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 smooth-transition"></div>
                  
                  {/* Rating */}
                  <div className="absolute top-3 right-3 glass-card rounded-full px-3 py-1 flex items-center transform translate-y-0 group-hover:-translate-y-1 smooth-transition">
                    <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
                    <span className="text-sm font-semibold text-white">5.0</span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-green-primary/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium capitalize transform translate-y-0 group-hover:-translate-y-1 smooth-transition">
                    {categoryLabels[attraction.category as keyof typeof categoryLabels]}
                  </div>

                  {/* Sliding information overlay */}
                  <div className="absolute inset-x-0 bottom-0 transform translate-y-full group-hover:translate-y-0 smooth-transition duration-500 ease-out">
                    <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-8">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {attraction.name}
                      </h3>
                      <p className="text-gray-200 text-sm mb-3 line-clamp-2 leading-relaxed">
                        {attraction.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-300">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-xs font-medium">Descubrir más</span>
                        </div>
                        {isCentered && (
                          <div className="text-xs text-green-300 font-semibold bg-green-500/20 px-2 py-1 rounded-full">
                            ¡Clic aquí!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-center text-ocean/60 text-sm">
                    <span>Hover para detalles</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {attractions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
            className={`w-3 h-3 rounded-full smooth-transition ${
              index === currentIndex 
                ? 'bg-green-primary scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a atracción ${index + 1}`}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedAttraction && (
        <AttractionModal 
          attraction={selectedAttraction} 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
};
