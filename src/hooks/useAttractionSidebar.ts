import { useState, useEffect } from "react";
import { TouristAttraction } from "@/types/touristAttractions";

export const useAttractionSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<TouristAttraction | null>(null);

  // Auto-open sidebar when an attraction is selected
  useEffect(() => {
    if (selectedAttraction) {
      setIsOpen(true);
    }
  }, [selectedAttraction]);

  const openSidebar = (attraction: TouristAttraction) => {
    setSelectedAttraction(attraction);
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    // Delay clearing selection to allow for smooth close animation
    setTimeout(() => {
      setSelectedAttraction(null);
    }, 300);
  };

  const toggleSidebar = () => {
    if (isOpen) {
      closeSidebar();
    } else {
      setIsOpen(true);
    }
  };

  return {
    isOpen,
    selectedAttraction,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    setSelectedAttraction
  };
};