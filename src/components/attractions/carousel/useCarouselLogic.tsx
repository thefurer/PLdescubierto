import { useState, useRef, useEffect } from "react";
import { TouristAttraction } from "@/types/touristAttractions";

export const useCarouselLogic = (attractions: TouristAttraction[]) => {
  // Find the index of "Isla de la Plata" or default to middle
  const findIslaIndex = () => {
    const islaIndex = attractions.findIndex(attraction => 
      attraction.name.toLowerCase().includes('isla de la plata')
    );
    return islaIndex !== -1 ? islaIndex : Math.floor(attractions.length / 2);
  };

  const [currentIndex, setCurrentIndex] = useState(findIslaIndex());
  const [selectedAttraction, setSelectedAttraction] = useState<TouristAttraction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      // Updated card width and gap for larger cards
      const cardWidth = 320; // Width of each card (w-80)
      const gap = 32; // Gap between cards (gap-8)
      const scrollPosition = index * (cardWidth + gap) - (carouselRef.current.clientWidth / 2) + (cardWidth / 2);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const clearAllTimeouts = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  // Auto-scroll functionality
  const startAutoScroll = () => {
    if (isPaused) return;
    
    clearAllTimeouts();
    autoScrollRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex(prev => {
          const nextIndex = prev < attractions.length - 1 ? prev + 1 : 0;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }
    }, 5000);
  };

  const stopAutoScroll = () => {
    clearAllTimeouts();
  };

  const togglePause = () => {
    setIsPaused(prev => {
      const newPaused = !prev;
      if (newPaused) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
      return newPaused;
    });
  };

  const handlePrevious = () => {
    stopAutoScroll();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : attractions.length - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    
    // Only resume if not manually paused
    if (!isPaused) {
      resumeTimeoutRef.current = setTimeout(startAutoScroll, 3000);
    }
  };

  const handleNext = () => {
    stopAutoScroll();
    const newIndex = currentIndex < attractions.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    
    // Only resume if not manually paused
    if (!isPaused) {
      resumeTimeoutRef.current = setTimeout(startAutoScroll, 3000);
    }
  };

  const handleCardClick = (attraction: TouristAttraction, index: number) => {
    stopAutoScroll();
    if (index === currentIndex) {
      setSelectedAttraction(attraction);
      setModalOpen(true);
    } else {
      setCurrentIndex(index);
      scrollToIndex(index);
      // Only resume if not manually paused
      if (!isPaused) {
        resumeTimeoutRef.current = setTimeout(startAutoScroll, 3000);
      }
    }
  };

  const handleIndicatorClick = (index: number) => {
    stopAutoScroll();
    setCurrentIndex(index);
    scrollToIndex(index);
    // Only resume if not manually paused
    if (!isPaused) {
      resumeTimeoutRef.current = setTimeout(startAutoScroll, 3000);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    // Only resume if not manually paused
    if (!isPaused) {
      setTimeout(startAutoScroll, 1000);
    }
  };

  const handleMouseEnter = () => {
    if (!isPaused) {
      stopAutoScroll();
    }
  };

  const handleMouseLeave = () => {
    if (!isPaused) {
      startAutoScroll();
    }
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
    if (!isPaused) {
      startAutoScroll();
    }
    
    return () => clearAllTimeouts();
  }, [isPaused]);

  return {
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
  };
};
