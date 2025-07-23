
import { TouristAttraction } from "@/types/touristAttractions";
import { AttractionModal } from "./AttractionModal";
import { CarouselControls } from "./carousel/CarouselControls";
import { CarouselCard } from "./carousel/CarouselCard";
import { CarouselIndicators } from "./carousel/CarouselIndicators";
import { useCarouselLogic } from "./carousel/useCarouselLogic";

interface AttractionsCarouselProps {
  attractions: TouristAttraction[];
  onAttractionSelect?: (attraction: TouristAttraction) => void;
}

export const AttractionsCarousel = ({ attractions, onAttractionSelect }: AttractionsCarouselProps) => {
  const {
    currentIndex,
    selectedAttraction,
    modalOpen,
    isPaused,
    carouselRef,
    handlePrevious,
    handleNext,
    handleCardClick,
    handleIndicatorClick,
    handleModalClose,
    handleMouseEnter,
    handleMouseLeave,
    togglePause
  } = useCarouselLogic(attractions);

  return (
    <div 
      className="relative py-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navigation Buttons */}
      <CarouselControls 
        onPrevious={handlePrevious} 
        onNext={handleNext}
        onTogglePause={togglePause}
        isPaused={isPaused}
      />

      {/* Carousel Container - Improved spacing and sizing */}
      <div
        ref={carouselRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide px-16 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {attractions.map((attraction, index) => (
          <CarouselCard
            key={attraction.id}
            attraction={attraction}
            index={index}
            currentIndex={currentIndex}
            onClick={(attraction, index) => {
              handleCardClick(attraction, index);
              onAttractionSelect?.(attraction);
            }}
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
