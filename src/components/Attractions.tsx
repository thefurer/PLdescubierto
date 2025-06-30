
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTouristAttractions } from "@/hooks/useTouristAttractions";
import { AttractionsHeader } from "./attractions/AttractionsHeader";
import { CategoryFilters } from "./attractions/CategoryFilters";
import { AttractionsGrid } from "./attractions/AttractionsGrid";
import { AttractionsCarousel } from "./attractions/AttractionsCarousel";
import { ShowMoreButton } from "./attractions/ShowMoreButton";

type AttractionsProps = {
  className?: string;
};

const Attractions = ({ className }: AttractionsProps) => {
  const { attractions, loading } = useTouristAttractions();
  const [activeCategory, setActiveCategory] = useState<string>("todo");
  const [showAllAttractions, setShowAllAttractions] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  const filteredAttractions = activeCategory === "todo" 
    ? attractions 
    : attractions.filter(attr => attr.category === activeCategory);

  // Show first 8 attractions (2 rows) or all if expanded for grid view
  const displayedAttractions = showAllAttractions 
    ? filteredAttractions 
    : filteredAttractions.slice(0, 8);

  const hasMoreAttractions = filteredAttractions.length > 8;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowAllAttractions(false);
    // Switch to carousel for "todo" category, grid for specific categories
    setViewMode(category === "todo" ? 'carousel' : 'grid');
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
              <p className="text-lg text-ocean font-medium">Cargando atracciones...</p>
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

        {/* Render carousel for "todo" category, grid for specific categories */}
        {viewMode === 'carousel' && activeCategory === "todo" ? (
          <AttractionsCarousel attractions={filteredAttractions} />
        ) : (
          <>
            <AttractionsGrid attractions={displayedAttractions} />
            <ShowMoreButton
              hasMoreAttractions={hasMoreAttractions}
              showAllAttractions={showAllAttractions}
              onToggleShowAll={handleToggleShowAll}
              displayedCount={displayedAttractions.length}
              totalCount={filteredAttractions.length}
              activeCategory={activeCategory}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Attractions;
