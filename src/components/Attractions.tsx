
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTouristAttractions } from "@/hooks/useTouristAttractions";
import { AttractionsHeader } from "./attractions/AttractionsHeader";
import { CategoryFilters } from "./attractions/CategoryFilters";
import { AttractionsGrid } from "./attractions/AttractionsGrid";
import { ShowMoreButton } from "./attractions/ShowMoreButton";

type AttractionsProps = {
  className?: string;
};

const Attractions = ({ className }: AttractionsProps) => {
  const { attractions, loading } = useTouristAttractions();
  const [activeCategory, setActiveCategory] = useState<string>("todo");
  const [showAllAttractions, setShowAllAttractions] = useState(false);

  const filteredAttractions = activeCategory === "todo" 
    ? attractions 
    : attractions.filter(attr => attr.category === activeCategory);

  // Show first 8 attractions (2 rows) or all if expanded
  const displayedAttractions = showAllAttractions 
    ? filteredAttractions 
    : filteredAttractions.slice(0, 8);

  const hasMoreAttractions = filteredAttractions.length > 8;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowAllAttractions(false);
  };

  const handleToggleShowAll = () => {
    setShowAllAttractions(!showAllAttractions);
  };

  if (loading) {
    return (
      <section id="attractions" className={cn("py-20 bg-gradient-to-b from-white to-green-muted", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="glass-card p-8 rounded-2xl inline-block">
              <p className="text-lg text-ocean">Cargando atracciones...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="attractions" 
      className={cn("py-20 bg-gradient-to-b from-white via-green-muted/30 to-white", className)}
    >
      <div className="container mx-auto px-4">
        <AttractionsHeader totalCount={attractions.length} />
        
        <CategoryFilters 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <AttractionsGrid attractions={displayedAttractions} />

        <ShowMoreButton
          hasMoreAttractions={hasMoreAttractions}
          showAllAttractions={showAllAttractions}
          onToggleShowAll={handleToggleShowAll}
          displayedCount={displayedAttractions.length}
          totalCount={filteredAttractions.length}
          activeCategory={activeCategory}
        />
      </div>
    </section>
  );
};

export default Attractions;
