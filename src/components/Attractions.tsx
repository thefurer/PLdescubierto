
import { useState } from "react";
import { MapPin, Star, ChevronRight, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type AttractionsProps = {
  className?: string;
};

// Puerto Lopez Attractions Data
const attractions = [
  {
    id: 1,
    name: "Machalilla National Park",
    description: "A protected area featuring diverse ecosystems including coastal forests, pristine beaches, and cloud forests.",
    category: "Nature",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Los Frailes Beach",
    description: "One of Ecuador's most beautiful beaches with crystal clear waters, white sand, and surrounded by cliffs.",
    category: "Beach",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Isla de la Plata",
    description: "Known as the 'Poor Man's Galapagos,' home to blue-footed boobies, frigatebirds, and sea lions.",
    category: "Wildlife",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Agua Blanca Community",
    description: "An indigenous community offering cultural experiences, archaeological remains, and sulfur lagoons.",
    category: "Culture",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Puerto Lopez Beach",
    description: "The main beach with its colorful fishing boats and vibrant local atmosphere.",
    category: "Beach",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Salango Island",
    description: "A small island with excellent snorkeling opportunities and diverse marine life.",
    category: "Wildlife",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Salango Museum",
    description: "Archaeological museum showcasing artifacts from pre-Columbian cultures that inhabited the region.",
    category: "Culture",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1594218139139-d194bb15394e?auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Rio Ayampe",
    description: "A lush river valley with hiking trails, bird watching, and natural pools.",
    category: "Nature",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1587559070757-b4efd8be928d?auto=format&fit=crop&q=80"
  },
  // Additional attractions displayed in "View All" mode
  {
    id: 9,
    name: "Humpback Whale Watching",
    description: "Seasonal tours to observe the magnificent humpback whales during their migration (June-September).",
    category: "Wildlife",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    name: "La Playita Beach",
    description: "A secluded beach with calm waters ideal for swimming and relaxation.",
    category: "Beach",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1601791074012-d4e0ee30d77a?auto=format&fit=crop&q=80"
  },
  {
    id: 11,
    name: "El Sombrerito Beach",
    description: "A unique rock formation that resembles a hat, with tide pools and marine life.",
    category: "Nature",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1621335829175-95205d9b3229?auto=format&fit=crop&q=80"
  },
  {
    id: 12,
    name: "Montañita (Day Trip)",
    description: "Famous surf town just a short drive from Puerto Lopez, known for its vibrant nightlife.",
    category: "Entertainment",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80"
  }
];

// We'll represent the other 25 attractions as categories
const attractionCategories = [
  { name: "Natural Wonders", count: 8 },
  { name: "Cultural Sites", count: 7 },
  { name: "Beaches & Coastline", count: 9 },
  { name: "Adventure Activities", count: 6 },
  { name: "Culinary Experiences", count: 5 },
  { name: "Indigenous Communities", count: 2 }
];

const Attractions = ({ className }: AttractionsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [viewAll, setViewAll] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = ["Todo", "Naturaleza", "Playa", "Vida Salvaje", "Cultura", "Entretenimiento"];

  const filteredAttractions = activeCategory === "All" 
    ? attractions 
    : attractions.filter(attr => attr.category === activeCategory);

  const displayedAttractions = viewAll 
    ? filteredAttractions 
    : filteredAttractions.slice(0, 8);

  return (
    <section 
      id="attractions" 
      className={cn("py-20 bg-white", className)}
        >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
        37 Atracciones <span className="text-green-500">Imprescindibles</span>
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
            onClick={() => setActiveCategory(category)}
            className={cn(
          "px-6 py-2 rounded-full text-sm font-medium transition-colors",
          activeCategory === category
            ? "bg-ocean text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category}
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
            <span>Filtro: {activeCategory}</span>
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
            }}
            className={cn(
              "block w-full text-left px-4 py-2 rounded-md text-sm",
              activeCategory === category
            ? "bg-ocean-light text-ocean-dark"
            : "hover:bg-gray-100"
            )}
          >
            {category}
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
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <Star size={16} className="text-amber-500 mr-1" fill="currentColor" />
          <span className="text-sm font-medium">{attraction.rating}</span>
            </div>
            <div className="absolute bottom-3 left-3 bg-ocean/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs">
          {attraction.category}
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

        {/* Botón Ver Todo / Ver Menos */}
        <div className="text-center">
          <button
        onClick={() => setViewAll(!viewAll)}
        className="px-6 py-3 rounded-full bg-ocean hover:bg-ocean-dark text-white font-medium transition-colors inline-flex items-center"
          >
        {viewAll ? "Ver Menos" : "Ver Todas las Atracciones"}
        <ChevronRight size={18} className={viewAll ? "rotate-90 ml-1" : "ml-1"} />
          </button>
        </div>

        {/* Sección de Categorías */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-ocean-dark text-center mb-8">
        Explora las 37 Atracciones Por Categoría
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {attractionCategories.map((category, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-ocean-light/50 to-ocean-light/20 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h4 className="text-xl font-bold text-ocean-dark mb-2">{category.name}</h4>
            <p className="text-gray-600 mb-4">
          {category.count} destinos increíbles para explorar
            </p>
            <button className="text-ocean font-medium flex items-center hover:text-ocean-dark transition-colors">
          Descubrir <ChevronRight size={18} className="ml-1" />
            </button>
          </div>
        ))}
          </div>
        </div>
      </div>
        </section>
  );
};

export default Attractions;
