
interface CarouselIndicatorsProps {
  attractionsCount: number;
  currentIndex: number;
  onIndicatorClick: (index: number) => void;
}

export const CarouselIndicators = ({ 
  attractionsCount, 
  currentIndex, 
  onIndicatorClick 
}: CarouselIndicatorsProps) => {
  return (
    <div className="flex justify-center mt-8 gap-2">
      {Array.from({ length: attractionsCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          className={`w-3 h-3 rounded-full smooth-transition ${
            index === currentIndex 
              ? 'bg-green-primary scale-125' 
              : 'bg-white/50 hover:bg-white/70'
          }`}
          aria-label={`Ir a atracción ${index + 1}`}
        />
      ))}
    </div>
  );
};
