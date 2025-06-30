
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = 280; // Width of each card
      const gap = 24; // Gap between cards
      const scrollPosition = index * (cardWidth + gap) - (carouselRef.current.clientWidth / 2) + (cardWidth / 2);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll functionality with slower speed
  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev < attractions.length - 1 ? prev + 1 : 0;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, 5000); // Changed from 3000ms to 5000ms (5 seconds)
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  const handlePrevious = () => {
    stopAutoScroll();
    const newIndex = currentIndex > 0 ? currentIndex - 1 : attractions.length - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setTimeout(startAutoScroll, 7000); // Resume auto-scroll after 7 seconds
  };

  const handleNext = () => {
    stopAutoScroll();
    const newIndex = currentIndex < attractions.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
    setTimeout(startAutoScroll, 7000); // Resume auto-scroll after 7 seconds
  };

  const handleCardClick = (attraction: TouristAttraction, index: number) => {
    stopAutoScroll();
    if (index === currentIndex) {
      setSelectedAttraction(attraction);
      setModalOpen(true);
    } else {
      setCurrentIndex(index);
      scrollToIndex(index);
      setTimeout(startAutoScroll, 7000); // Resume auto-scroll after 7 seconds
    }
  };

  const handleIndicatorClick = (index: number) => {
    stopAutoScroll();
    setCurrentIndex(index);
    scrollToIndex(index);
    setTimeout(startAutoScroll, 7000);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTimeout(startAutoScroll, 1000);
  };

  useEffect(() => {
    scrollToIndex(currentIndex);
    startAutoScroll();
    
    return () => stopAutoScroll();
  }, []);

  return {
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
  };
};
