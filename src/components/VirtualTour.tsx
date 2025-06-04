
import { useState } from "react";
import { Compass, Headset, ChevronRight, Maximize, Monitor, Globe, Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

type VirtualTourProps = {
  className?: string;
};

const VirtualTour = ({ className }: VirtualTourProps) => {
  const [activeLocation, setActiveLocation] = useState(1);
  const { language } = useLanguage();

  const locations = [
    {
      id: 1,
      name: "Plaza Central Virtual",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80",
      description: language === 'es' 
        ? "Explora el centro del metaespacio de Puerto López, donde puedes interactuar con otros visitantes virtuales."
        : "Explore the center of Puerto López's metaspace, where you can interact with other virtual visitors."
    },
    {
      id: 2,
      name: "Galería Digital 3D",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80",
      description: language === 'es'
        ? "Una galería inmersiva en 3D donde puedes caminar entre las obras de arte y fotografías de Puerto López."
        : "An immersive 3D gallery where you can walk among artworks and photographs of Puerto López."
    },
    {
      id: 3,
      name: "Teatro Virtual",
      image: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&q=80",
      description: language === 'es'
        ? "Asiste a presentaciones en vivo sobre la historia y cultura de Puerto López en nuestro teatro virtual."
        : "Attend live presentations about Puerto López's history and culture in our virtual theater."
    },
    {
      id: 4,
      name: "Mirador 360°",
      image: "https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&q=80",
      description: language === 'es'
        ? "Disfruta de vistas panorámicas de 360° de los paisajes más hermosos de Puerto López."
        : "Enjoy 360° panoramic views of Puerto López's most beautiful landscapes."
    }
  ];

  const texts = {
    es: {
      title: "Experiencia en el",
      subtitle: "Metaverso",
      description: "Sumérgete en nuestro metaespacio interactivo de Puerto López. Una experiencia inmersiva donde puedes explorar, socializar y descubrir desde cualquier lugar del mundo.",
      enterMetaverse: "Entrar al Metaverso",
      exploreSpace: "Explorar Espacio",
      highlights: "Características del Metaespacio",
      tips: "Guía del Metaverso",
      tip1: "Usa auriculares VR para una experiencia completamente inmersiva",
      tip2: "Interactúa con otros visitantes usando tu avatar personalizado",
      tip3: "Explora diferentes áreas usando los portales de teletransporte",
      interactive: "Experiencias Interactivas",
      interactiveDesc: "Participa en tours guiados, eventos en vivo y actividades sociales en el metaespacio.",
      social: "Conexiones Sociales",
      socialDesc: "Conoce a otros amantes de Puerto López y comparte experiencias en tiempo real.",
      immersive: "Tecnología Inmersiva",
      immersiveDesc: "Experimenta Puerto López como nunca antes con gráficos 3D realistas y audio espacial.",
      explore: "Explorar"
    },
    en: {
      title: "Metaverse",
      subtitle: "Experience",
      description: "Dive into our interactive Puerto López metaspace. An immersive experience where you can explore, socialize and discover from anywhere in the world.",
      enterMetaverse: "Enter Metaverse",
      exploreSpace: "Explore Space",
      highlights: "Metaspace Features",
      tips: "Metaverse Guide",
      tip1: "Use VR headset for a completely immersive experience",
      tip2: "Interact with other visitors using your personalized avatar",
      tip3: "Explore different areas using teleportation portals",
      interactive: "Interactive Experiences",
      interactiveDesc: "Participate in guided tours, live events and social activities in the metaspace.",
      social: "Social Connections",
      socialDesc: "Meet other Puerto López lovers and share real-time experiences.",
      immersive: "Immersive Technology",
      immersiveDesc: "Experience Puerto López like never before with realistic 3D graphics and spatial audio.",
      explore: "Explore"
    }
  };

  const t = texts[language];

  return (
    <section 
      id="virtual-tour" 
      className={cn("py-20 bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title} <span className="text-cyan-400">{t.subtitle}</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-cyan-400/20">
            <div className="relative aspect-video">
              <iframe
                src="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
                className="w-full h-full"
                frameBorder="0"
                allow="camera; microphone; fullscreen; autoplay; display-capture; xr-spatial-tracking"
                allowFullScreen
                title="Puerto López Metaverse Experience"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✨ Metaespacio Activo
              </div>
            </div>
            <div className="p-6">
              <p className="text-white/80 mb-4">
                {locations[activeLocation - 1].description}
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://www.spatial.io/s/Puerto-Lopez-Manabi-Ecuador-Gallerys-677f3e643c6e19083de81c2a?share=8387764241473890378"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center gap-2 hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 font-medium"
                >
                  <Headset size={20} />
                  <span>{t.enterMetaverse}</span>
                </a>
                <button className="px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/20">
                  <Globe size={18} />
                  <span>{t.exploreSpace}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-purple-400/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Monitor className="text-cyan-400" size={24} />
              Áreas del Metaespacio
            </h3>
            
            <div className="space-y-4">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => setActiveLocation(location.id)}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-start transition-all transform hover:scale-105",
                    activeLocation === location.id 
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white" 
                      : "bg-black/20 text-white/70 hover:bg-black/40 border border-white/10"
                  )}
                >
                  <div className="flex-1 text-left">
                    <h4 className="font-medium mb-1">{location.name}</h4>
                    <p className="text-sm opacity-80 line-clamp-2">{location.description}</p>
                  </div>
                  <ChevronRight size={20} className={activeLocation === location.id ? "opacity-100 text-cyan-400" : "opacity-50"} />
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl border border-cyan-400/20">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Compass className="text-cyan-400" size={18} />
                {t.tips}
              </h4>
              <ul className="text-white/80 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">1</span>
                  <span>{t.tip1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">2</span>
                  <span>{t.tip2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">3</span>
                  <span>{t.tip3}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-all border border-cyan-400/20 hover:border-cyan-400/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <h4 className="text-white font-bold text-lg">{t.interactive}</h4>
            </div>
            <p className="text-white/70 mb-4">{t.interactiveDesc}</p>
            <button className="text-cyan-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-medium">
              {t.explore} <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-all border border-purple-400/20 hover:border-purple-400/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Headset className="text-white" size={24} />
              </div>
              <h4 className="text-white font-bold text-lg">{t.social}</h4>
            </div>
            <p className="text-white/70 mb-4">{t.socialDesc}</p>
            <button className="text-purple-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-medium">
              {t.explore} <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-all border border-blue-400/20 hover:border-blue-400/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Video className="text-white" size={24} />
              </div>
              <h4 className="text-white font-bold text-lg">{t.immersive}</h4>
            </div>
            <p className="text-white/70 mb-4">{t.immersiveDesc}</p>
            <button className="text-blue-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-medium">
              {t.explore} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
