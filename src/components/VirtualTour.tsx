
import { useState } from "react";
import { Compass, Headset, ChevronRight, Maximize, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

type VirtualTourProps = {
  className?: string;
};

const VirtualTour = ({ className }: VirtualTourProps) => {
  const [activeLocation, setActiveLocation] = useState(1);
  const { language } = useLanguage();

  // Define the locations array that was missing
  const locations = [
    {
      id: 1,
      name: "Playa Los Frailes",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
      description: language === 'es' 
        ? "Una hermosa playa virgen dentro del Parque Nacional Machalilla, conocida por sus aguas cristalinas y arena blanca."
        : "A pristine beach within Machalilla National Park, known for its crystal-clear waters and white sand."
    },
    {
      id: 2,
      name: "Isla de la Plata",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
      description: language === 'es'
        ? "Conocida como la 'Pequeña Galápagos', es hogar de aves marinas, tortugas y una increíble vida marina."
        : "Known as the 'Poor Man's Galapagos', home to seabirds, turtles, and amazing marine life."
    },
    {
      id: 3,
      name: "Avistamiento de Ballenas",
      image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
      description: language === 'es'
        ? "Experimenta el espectáculo de las ballenas jorobadas migrando desde junio hasta septiembre."
        : "Experience the spectacle of humpback whales migrating from June through September."
    },
    {
      id: 4,
      name: "Parque Nacional Machalilla",
      image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80",
      description: language === 'es'
        ? "Un parque que combina bosque seco, playa y mar, con una biodiversidad increíble."
        : "A park that combines dry forest, beach, and sea, with incredible biodiversity."
    }
  ];

  const texts = {
    es: {
      title: "Experiencia",
      subtitle: "Virtual",
      description: "¿No puedes visitarnos en persona? Explora Puerto López desde cualquier parte del mundo a través de nuestros tours virtuales inmersivos.",
      enterVR: "Entrar en VR",
      tour360: "Tour 360°",
      highlights: "Destacados",
      tips: "Consejos para Realidad Virtual",
      tip1: "Usa un visor VR para la experiencia más inmersiva",
      tip2: "Haz clic y arrastra para mirar alrededor en modo 360°",
      tip3: "Usa la brújula para navegar entre diferentes puntos de vista",
      vrTours: "Tours VR Guiados",
      vrToursDesc: "Experimenta tours virtuales guiados con narración experta y contexto histórico.",
      maps: "Mapas Interactivos",
      mapsDesc: "Navega a través de mapas 3D detallados de Puerto López y sus alrededores.",
      timelapse: "Experiencias Time-lapse",
      timelapseDesc: "Observa espectaculares amaneceres, atardeceres y migraciones de ballenas en time-lapse.",
      explore: "Explorar"
    },
    en: {
      title: "Virtual",
      subtitle: "Experience",
      description: "Can't visit in person right now? Explore Puerto Lopez from anywhere in the world through our immersive virtual tours.",
      enterVR: "Enter VR Mode",
      tour360: "360° Tour",
      highlights: "Activity Highlights",
      tips: "Virtual Reality Tips",
      tip1: "Use a VR headset for the most immersive experience",
      tip2: "Click and drag to look around in 360° mode",
      tip3: "Use the compass to navigate to different viewpoints",
      vrTours: "VR Guided Tours",
      vrToursDesc: "Experience guided virtual tours with expert narration and historical context.",
      maps: "Interactive Maps",
      mapsDesc: "Navigate through detailed 3D maps of Puerto Lopez and surrounding areas.",
      timelapse: "Time-lapse Experiences",
      timelapseDesc: "Watch spectacular sunrises, sunsets, and whale migrations in time-lapse.",
      explore: "Explore"
    }
  };

  const t = texts[language];

  return (
    <section 
      id="virtual-tour" 
      className={cn("py-20 bg-gradient-to-b from-ocean-dark to-ocean", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title} <span className="text-sunset">{t.subtitle}</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <div className="relative aspect-video">
              <img 
                src={locations[activeLocation - 1].image} 
                alt={locations[activeLocation - 1].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white text-xl font-bold">{locations[activeLocation - 1].name}</h3>
                  <p className="text-white/80 text-sm">Puerto Lopez, Ecuador</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
                    <Compass size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-white/80 mb-4">
                {locations[activeLocation - 1].description}
              </p>
              <div className="flex justify-between items-center">
                <a 
                  href="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-sunset text-white flex items-center gap-2 hover:bg-sunset/90 transition-colors text-sm"
                >
                  <Headset size={16} />
                  <span>{t.enterVR}</span>
                </a>
                <button className="px-4 py-2 rounded-full bg-white/10 text-white flex items-center gap-2 hover:bg-white/20 transition-colors text-sm">
                  <Monitor size={16} />
                  <span>{t.tour360}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Select Location</h3>
            
            <div className="space-y-4">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocation(location.id)}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-start transition-all",
                    activeLocation === location.id 
                      ? "bg-ocean text-white" 
                      : "bg-black/20 text-white/70 hover:bg-black/40"
                  )}
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{location.name}</h4>
                    <p className="text-sm opacity-80 line-clamp-2">{location.description}</p>
                  </div>
                  <ChevronRight size={20} className={activeLocation === location.id ? "opacity-100" : "opacity-50"} />
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-sunset/20 to-coral/20 rounded-xl">
              <h4 className="text-white font-medium mb-2">{t.tips}</h4>
              <ul className="text-white/80 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sunset/50 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">1</span>
                  <span>{t.tip1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sunset/50 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">2</span>
                  <span>{t.tip2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sunset/50 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">3</span>
                  <span>{t.tip3}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-colors">
            <h4 className="text-white font-bold text-lg mb-3">{t.vrTours}</h4>
            <p className="text-white/70 mb-4">{t.vrToursDesc}</p>
            <button className="text-sunset flex items-center gap-1 hover:text-white transition-colors text-sm">
              {t.explore} <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-colors">
            <h4 className="text-white font-bold text-lg mb-3">{t.maps}</h4>
            <p className="text-white/70 mb-4">{t.mapsDesc}</p>
            <button className="text-sunset flex items-center gap-1 hover:text-white transition-colors text-sm">
              {t.explore} <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-colors">
            <h4 className="text-white font-bold text-lg mb-3">{t.timelapse}</h4>
            <p className="text-white/70 mb-4">{t.timelapseDesc}</p>
            <button className="text-sunset flex items-center gap-1 hover:text-white transition-colors text-sm">
              {t.explore} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
