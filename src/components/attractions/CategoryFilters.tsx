
import { useState } from "react";
import { Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";

interface CategoryFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["todo", "playa", "cultura", "naturaleza"];

export const CategoryFilters = ({ activeCategory, onCategoryChange }: CategoryFiltersProps) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const t = useTranslations();

  const categoryLabels: Record<string, string> = {
    todo: t.allCategories,
    playa: t.categoryBeach,
    cultura: t.categoryCulture,
    naturaleza: t.categoryNature
  };

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setMobileFiltersOpen(false);
  };

  return (
    <div className="mb-10">
      {/* Desktop Filters */}
      <div className="hidden md:flex justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={cn(
              "px-8 py-3 rounded-full text-sm font-semibold smooth-transition shadow-md hover:shadow-lg",
              activeCategory === category
                ? "bg-ocean text-white shadow-ocean/30 transform scale-105"
                : "bg-white text-gray-700 hover:bg-green-light hover:text-green-dark border border-gray-200"
            )}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden flex flex-col mb-8">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="glass-card flex items-center justify-between px-4 py-3 rounded-lg mb-2 smooth-transition hover:bg-white/80"
        >
          <span className="flex items-center text-ocean-dark">
            <Filter size={18} className="mr-2 text-green-primary" />
            <span className="font-medium">{t.filterLabel}: {categoryLabels[activeCategory]}</span>
          </span>
          <ChevronRight
            size={18}
            className={cn(
              "smooth-transition text-ocean",
              mobileFiltersOpen ? "rotate-90" : ""
            )}
          />
        </button>
        {mobileFiltersOpen && (
          <div className="glass-card rounded-lg p-2 animate-fade-in">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  "block w-full text-left px-4 py-3 rounded-md text-sm font-medium smooth-transition",
                  activeCategory === category
                    ? "bg-ocean text-white"
                    : "hover:bg-green-light text-gray-700"
                )}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
