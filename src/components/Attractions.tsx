
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
      <section id="attractions" className={cn("py-20 bg-white", className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-lg text-gray-600">Cargando atracciones...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="attractions" 
      className={cn("py-20 bg-white", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
            {attractions.length} Atracciones <span className="text-green-500">Imprescindibles</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explora la belleza natural, riqueza cultural y aventuras sin fin que te esperan en Puerto López. Desde playas vírgenes hasta encuentros con vida silvestre, hay algo para todos.
          </p>
        </div>

        {/* Filtros de Categoría */}
        <div className="mb-10">
          {/* Filtros para Escritorio */}
          <div className="hidden md:flex justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setShowAllAttractions(false); // Reset view when changing category
                }}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors",
                  activeCategory === category
                    ? "bg-ocean text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {categoryLabels[category as keyof typeof categoryLabels]}
              </button>
            ))}
          </div>

          {/* Filtros para Móvil */}
          <div className="md:hidden flex flex-col mb-8">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg mb-2"
            >
              <span className="flex items-center">
                <Filter size={18} className="mr-2" />
                <span>Filtro: {categoryLabels[activeCategory as keyof typeof categoryLabels]}</span>
              </span>
              <ChevronRight
                size={18}
                className={cn(
                  "transition-transform",
                  mobileFiltersOpen ? "rotate-90" : ""
                )}
              />
            </button>
            {mobileFiltersOpen && (
              <div className="bg-white shadow-md rounded-lg p-2 animate-fade-in">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setMobileFiltersOpen(false);
                      setShowAllAttractions(false); // Reset view when changing category
                    }}
                    className={cn(
                      "block w-full text-left px-4 py-2 rounded-md text-sm",
                      activeCategory === category
                        ? "bg-ocean-light text-ocean-dark"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cuadrícula de Atracciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayedAttractions.map((attraction) => (
            <div
              key={attraction.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={attraction.image_url || defaultImages[attraction.category as keyof typeof defaultImages] || defaultImages.naturaleza}
                  alt={attraction.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-ocean/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs capitalize">
                  {categoryLabels[attraction.category as keyof typeof categoryLabels]}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-ocean-dark mb-2">{attraction.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{attraction.description}</p>
                <div className="flex items-center text-ocean">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">Puerto López</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón Ver Más y Contador */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Mostrando {displayedAttractions.length} de {filteredAttractions.length} atracciones
            {activeCategory !== "todo" && (
              <span className="block text-sm text-ocean mt-1">
                en la categoría {categoryLabels[activeCategory as keyof typeof categoryLabels]}
              </span>
            )}
          </p>
          
          {hasMoreAttractions && (
            <Button
              onClick={() => setShowAllAttractions(!showAllAttractions)}
              variant="outline"
              className="px-8 py-3 text-ocean border-ocean hover:bg-ocean hover:text-white transition-colors"
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
