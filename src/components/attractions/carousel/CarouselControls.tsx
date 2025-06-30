
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const CarouselControls = ({ onPrevious, onNext }: CarouselControlsProps) => {
  return (
    <>
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 glass-card p-3 rounded-full hover:bg-white/20 smooth-transition"
        aria-label="Anterior atracción"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      
      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 glass-card p-3 rounded-full hover:bg-white/20 smooth-transition"
        aria-label="Siguiente atracción"
      >
        <ChevronRight size={24} className="text-white" />
      </button>
    </>
  );
};
