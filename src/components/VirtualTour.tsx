
import { useState } from "react";
import { Compass, Headset, ChevronRight, Maximize, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type VirtualTourProps = {
  className?: string;
};

const VirtualTour = ({ className }: VirtualTourProps) => {
  const [activeLocation, setActiveLocation] = useState(1);

  const locations = [
    {
      id: 1,
      name: "Los Frailes Beach",
      description: "Experience the pristine beauty of Los Frailes Beach with its crystal clear waters and white sand, surrounded by lush cliffs.",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Machalilla National Park",
      description: "Explore the diverse ecosystems of Machalilla National Park, from coastal forests to mountain trails.",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Isla de la Plata",
      description: "Discover the 'Poor Man's Galapagos' with its incredible wildlife including blue-footed boobies and sea lions.",
      image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section 
      id="virtual-tour" 
      className={cn("py-20 bg-gradient-to-b from-ocean-dark to-ocean", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Virtual <span className="text-sunset">Experience</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Can't visit in person right now? Explore Puerto Lopez from anywhere in the world through our immersive virtual tours.
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
              
              {/* VR Controls */}
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
                <button className="px-4 py-2 rounded-full bg-sunset text-white flex items-center gap-2 hover:bg-sunset/90 transition-colors text-sm">
                  <Headset size={16} />
                  <span>Enter VR Mode</span>
                </button>
                <button className="px-4 py-2 rounded-full bg-white/10 text-white flex items-center gap-2 hover:bg-white/20 transition-colors text-sm">
                  <Monitor size={16} />
                  <span>360° Tour</span>
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
              <h4 className="text-white font-medium mb-2">Virtual Reality Tips</h4>
              <ul className="text-white/80 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sunset/50 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">1</span>
                  <span>Use a VR headset for the most immersive experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sunset/50 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">2</span>
                  <span>Click and drag to look around in 360° mode</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sunset/50 flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5">3</span>
                  <span>Use the compass to navigate to different viewpoints</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Virtual Experience Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-colors">
            <h4 className="text-white font-bold text-lg mb-3">VR Guided Tours</h4>
            <p className="text-white/70 mb-4">Experience guided virtual tours with expert narration and historical context.</p>
            <button className="text-sunset flex items-center gap-1 hover:text-white transition-colors text-sm">
              Explore <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-colors">
            <h4 className="text-white font-bold text-lg mb-3">Interactive Maps</h4>
            <p className="text-white/70 mb-4">Navigate through detailed 3D maps of Puerto Lopez and surrounding areas.</p>
            <button className="text-sunset flex items-center gap-1 hover:text-white transition-colors text-sm">
              Explore <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 hover:bg-black/30 transition-colors">
            <h4 className="text-white font-bold text-lg mb-3">Time-lapse Experiences</h4>
            <p className="text-white/70 mb-4">Watch spectacular sunrises, sunsets, and whale migrations in time-lapse.</p>
            <button className="text-sunset flex items-center gap-1 hover:text-white transition-colors text-sm">
              Explore <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualTour;
