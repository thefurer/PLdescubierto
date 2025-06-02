
import { ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShowMoreButtonProps {
  hasMoreAttractions: boolean;
  showAllAttractions: boolean;
  onToggleShowAll: () => void;
  displayedCount: number;
  totalCount: number;
  activeCategory: string;
}

const categoryLabels = {
  todo: "Todo",
  playa: "Playa", 
  cultura: "Cultura",
  naturaleza: "Naturaleza"
};

export const ShowMoreButton = ({
  hasMoreAttractions,
  showAllAttractions,
  onToggleShowAll,
  displayedCount,
  totalCount,
  activeCategory
}: ShowMoreButtonProps) => {
  return (
    <div className="text-center">
      <div className="glass-card rounded-2xl p-6 inline-block mb-6">
        <p className="text-gray-700 mb-2 font-medium">
          Mostrando {displayedCount} de {totalCount} atracciones
          {activeCategory !== "todo" && (
            <span className="block text-sm text-ocean mt-1">
              en la categoría <span className="font-semibold text-green-primary">
                {categoryLabels[activeCategory as keyof typeof categoryLabels]}
              </span>
            </span>
          )}
        </p>
      </div>
      
      {hasMoreAttractions && (
        <Button
          onClick={onToggleShowAll}
          className={cn(
            "px-8 py-3 rounded-full font-semibold smooth-transition shadow-lg hover:shadow-xl transform hover:scale-105",
            showAllAttractions 
              ? "bg-ocean-dark text-white hover:bg-ocean" 
              : "bg-green-primary text-white hover:bg-green-dark"
          )}
        >
          {showAllAttractions ? (
            <>
              Ver menos
              <ChevronRight className="ml-2 h-4 w-4 rotate-90" />
            </>
          ) : (
            <>
              Ver más atracciones
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
