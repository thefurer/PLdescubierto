
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface CarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
}

export const CarouselControls = ({ onPrevious, onNext, onTogglePause, isPaused }: CarouselControlsProps) => {
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

      {/* Pause/Play Button - More visible */}
      <button
        onClick={onTogglePause}
        className="absolute right-4 top-4 z-10 bg-black/70 hover:bg-black/90 p-3 rounded-full smooth-transition border-2 border-white/30"
        aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
      >
        {isPaused ? (
          <Play size={20} className="text-white fill-white" />
        ) : (
          <Pause size={20} className="text-white fill-white" />
        )}
      </button>
    </>
  );
};
