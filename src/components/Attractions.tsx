
import { useState } from "react";
import { MapPin, Star, ChevronRight, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTouristAttractions } from "@/hooks/useTouristAttractions";
import { Button } from "@/components/ui/button";

type AttractionsProps = {
  className?: string;
};

const Attractions = ({ className }: AttractionsProps) => {
  const { attractions, loading } = useTouristAttractions();
  const [activeCategory, setActiveCategory] = useState<string>("todo");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showAllAttractions, setShowAllAttractions] = useState(false);

  const categories = ["todo", "playa", "cultura", "naturaleza"];
  const categoryLabels = {
    todo: "Todo",
    playa: "Playa", 
    cultura: "Cultura",
    naturaleza: "Naturaleza"
  };

  // Default images for categories when no image_url is provided
  const defaultImages = {
    playa: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80",
    cultura: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80", 
    naturaleza: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80"
  };

  const filteredAttractions = activeCategory === "todo" 
    ? attractions 
    : attractions.filter(attr => attr.category === activeCategory);

  // Show first 8 attractions (2 rows) or all if expanded
  const displayedAttractions = showAllAttractions 
    ? filteredAttractions 
    : filteredAttractions.slice(0, 8);

  const hasMoreAttractions = filteredAttractions.length > 8;

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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
            {attractions.length} Atracciones <span className="text-green-primary">Imprescindibles</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explora la belleza natural, riqueza cultural y aventuras sin fin que te esperan en Puerto López. 
            Desde playas vírgenes hasta encuentros con vida silvestre, hay algo para todos.
          </p>
        </div>

        {/* Enhanced Category Filters */}
        <div className="mb-10">
          {/* Desktop Filters */}
          <div className="hidden md:flex justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setShowAllAttractions(false);
                }}
                className={cn(
                  "px-8 py-3 rounded-full text-sm font-semibold smooth-transition shadow-md hover:shadow-lg",
                  activeCategory === category
                    ? "bg-ocean text-white shadow-ocean/30 transform scale-105"
                    : "bg-white text-gray-700 hover:bg-green-light hover:text-green-dark border border-gray-200"
                )}
              >
                {categoryLabels[category as keyof typeof categoryLabels]}
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
                <span className="font-medium">Filtro: {categoryLabels[activeCategory as keyof typeof categoryLabels]}</span>
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
                    onClick={() => {
                      setActiveCategory(category);
                      setMobileFiltersOpen(false);
                      setShowAllAttractions(false);
                    }}
                    className={cn(
                      "block w-full text-left px-4 py-3 rounded-md text-sm font-medium smooth-transition",
                      activeCategory === category
                        ? "bg-ocean text-white"
                        : "hover:bg-green-light text-gray-700"
                    )}
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Attractions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedAttractions.map((attraction, index) => (
            <div
              key={attraction.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl smooth-transition transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={attraction.image_url || defaultImages[attraction.category as keyof typeof defaultImages] || defaultImages.naturaleza}
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30"></div>
                <div className="absolute top-3 right-3 glass-card rounded-full px-3 py-1 flex items-center">
                  <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
                  <span className="text-sm font-semibold text-white">4.8</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-green-primary/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium capitalize">
                  {categoryLabels[attraction.category as keyof typeof categoryLabels]}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-ocean-dark mb-3 group-hover:text-green-primary smooth-transition">
                  {attraction.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {attraction.description}
                </p>
                <div className="flex items-center text-ocean">
                  <MapPin size={16} className="mr-2 text-green-primary" />
                  <span className="text-sm font-medium">Puerto López</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced More Button and Counter */}
        <div className="text-center">
          <div className="glass-card rounded-2xl p-6 inline-block mb-6">
            <p className="text-gray-700 mb-2 font-medium">
              Mostrando {displayedAttractions.length} de {filteredAttractions.length} atracciones
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
              onClick={() => setShowAllAttractions(!showAllAttractions)}
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
      </div>
    </section>
  );
};

export default Attractions;
