
import { TouristAttraction } from "@/hooks/useTouristAttractions";
import { AttractionCard } from "./AttractionCard";

interface AttractionsGridProps {
  attractions: TouristAttraction[];
  onAttractionSelect?: (attraction: TouristAttraction) => void;
}

export const AttractionsGrid = ({ attractions, onAttractionSelect }: AttractionsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {attractions.map((attraction, index) => (
        <AttractionCard
          key={attraction.id}
          attraction={attraction}
          index={index}
          onAttractionSelect={onAttractionSelect}
        />
      ))}
    </div>
  );
};
