
import { TouristAttraction } from "@/types/touristAttractions";
import { AttractionModal } from "./AttractionModal";
import { CarouselControls } from "./carousel/CarouselControls";
import { CarouselCard } from "./carousel/CarouselCard";
import { CarouselIndicators } from "./carousel/CarouselIndicators";
import { useCarouselLogic } from "./carousel/useCarouselLogic";

interface AttractionsCarouselProps {
  attractions: TouristAttraction[];
}

export const AttractionsCarousel = ({ attractions }: AttractionsCarouselProps) => {
  const {
    currentIndex,
    selectedAttraction,
    modalOpen,
    carouselRef,
    handlePrevious,
    handleNext,
    handleCardClick,
    handleIndicatorClick,
    handleModalClose,
    startAutoScroll,
    stopAutoScroll
  } = useCarouselLogic(attractions);

  return (
    <div 
      className="relative py-12"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      {/* Navigation Buttons */}
      <CarouselControls onPrevious={handlePrevious} onNext={handleNext} />

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {attractions.map((attraction, index) => (
          <CarouselCard
            key={attraction.id}
            attraction={attraction}
            index={index}
            currentIndex={currentIndex}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Indicators */}
      <CarouselIndicators
        attractionsCount={attractions.length}
        currentIndex={currentIndex}
        onIndicatorClick={handleIndicatorClick}
      />

      {/* Modal */}
      {selectedAttraction && (
        <AttractionModal 
          attraction={selectedAttraction} 
          isOpen={modalOpen} 
          onClose={handleModalClose} 
        />
      )}
    </div>
  );
};
