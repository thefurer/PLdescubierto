
import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { useLanguage } from "@/hooks/useLanguage";

const VirtualTour = () => {
  const { content } = useContentManager();
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Find virtual tour content from database
  const virtualTourContent = content.find(item => item.section_name === 'virtual_tour')?.content;

  const texts = {
    es: {
      title: virtualTourContent?.title || "Experiencia en el",
      subtitle: virtualTourContent?.subtitle || "Metaverso",
      description: virtualTourContent?.description || "Sumérgete en una experiencia única donde la realidad virtual te transporta directamente a las maravillas naturales de Puerto López. Explora cada rincón desde la comodidad de tu hogar.",
      startTour: "Iniciar Tour Virtual",
      fullscreen: "Pantalla Completa"
    },
    en: {
      title: virtualTourContent?.title || "Experience in the",
      subtitle: virtualTourContent?.subtitle || "Metaverse",
      description: virtualTourContent?.description || "Immerse yourself in a unique experience where virtual reality transports you directly to the natural wonders of Puerto López. Explore every corner from the comfort of your home.",
      startTour: "Start Virtual Tour",
      fullscreen: "Full Screen"
    }
  };

  const currentTexts = texts[language];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section id="virtual-tour" className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-ocean-dark mb-6">
            {currentTexts.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean to-green-primary">
              {currentTexts.subtitle}
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {currentTexts.description}
          </p>
        </div>

        {/* Virtual Tour Player */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl group">
            <div className="aspect-video bg-gradient-to-br from-ocean-dark via-ocean to-ocean-light flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
              
              <div className="relative z-10 text-center text-white">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-all duration-300 cursor-pointer" onClick={handlePlay}>
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </div>
                <h3 className="text-2xl font-bold mb-2">{currentTexts.startTour}</h3>
                <p className="text-white/80">360° Puerto López Experience</p>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePlay}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <button 
                    onClick={handleMute}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
                
                <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Tour Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Tour Virtual Disponible 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
