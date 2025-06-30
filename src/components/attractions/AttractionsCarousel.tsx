
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
              className={`flex-shrink-0 cursor-pointer smooth-transition ${
                isCentered 
                  ? 'w-80 scale-110 z-10' 
                  : 'w-72 scale-95 opacity-60 blur-[1px]'
              }`}
              onClick={() => handleCardClick(attraction, index)}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl smooth-transition h-96">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={displayImage} 
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Rating */}
                  <div className="absolute top-3 right-3 glass-card rounded-full px-3 py-1 flex items-center">
                    <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
                    <span className="text-sm font-semibold text-white">5.0</span>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3 bg-green-primary/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium capitalize">
                    {categoryLabels[attraction.category as keyof typeof categoryLabels]}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-ocean-dark mb-3 group-hover:text-green-primary smooth-transition line-clamp-2">
                    {attraction.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {attraction.description}
                  </p>
                  
                  {/* Location removed as requested */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-ocean">
                      <MapPin size={16} className="mr-2 text-green-primary" />
                      <span className="text-sm font-medium">Descubrir más</span>
                    </div>
                    {isCentered && (
                      <div className="text-xs text-green-primary font-semibold">
                        ¡Haz clic para explorar!
                      </div>
                    )}
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
