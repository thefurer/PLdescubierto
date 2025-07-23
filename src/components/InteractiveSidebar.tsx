
import { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttractionLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface InteractiveSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAttraction?: string;
}

const attractions: AttractionLocation[] = [
  { name: 'Playa Los Frailes', lat: -1.5667, lng: -80.6833, description: 'Playa paradisíaca' },
  { name: 'Isla de la Plata', lat: -1.2833, lng: -81.0833, description: 'Observación de ballenas' },
  { name: 'Agua Blanca', lat: -1.5167, lng: -80.7167, description: 'Sitio arqueológico' },
  { name: 'Puerto López', lat: -1.5667, lng: -80.7833, description: 'Pueblo pesquero' },
  { name: 'Salango', lat: -1.6000, lng: -80.8167, description: 'Museo arqueológico' },
  { name: 'Machalilla', lat: -1.6833, lng: -80.9333, description: 'Parque Nacional' },
];

const InteractiveSidebar = ({ isOpen, onClose, selectedAttraction }: InteractiveSidebarProps) => {
  const [activeAttraction, setActiveAttraction] = useState<AttractionLocation | null>(null);

  useEffect(() => {
    if (selectedAttraction) {
      const attraction = attractions.find(a => 
        a.name.toLowerCase().includes(selectedAttraction.toLowerCase())
      );
      if (attraction) {
        setActiveAttraction(attraction);
      }
    }
  }, [selectedAttraction]);

  const handleGetDirections = (attraction: AttractionLocation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.lat},${attraction.lng}&destination_place_id=${encodeURIComponent(attraction.name)}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="bg-gradient-to-r from-ocean to-green-primary text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              Mapa de Manabí
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-full">
          {/* Mini Map */}
          <div className="h-64 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127772.4!2d-80.8!3d-1.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902e0c0a0a0a0a0a%3A0x0a0a0a0a0a0a0a0a!2sManab%C3%AD%2C%20Ecuador!5e0!3m2!1ses!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Manabí"
            />
          </div>

          {/* Attractions List */}
          <div className="p-4 space-y-3 overflow-y-auto h-full">
            <h3 className="font-semibold text-ocean-dark mb-4">Principales Atracciones</h3>
            
            {attractions.map((attraction) => (
              <div
                key={attraction.name}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  activeAttraction?.name === attraction.name
                    ? 'bg-ocean-light/20 border-ocean shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setActiveAttraction(attraction)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-ocean-dark">{attraction.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(attraction);
                    }}
                    className="ml-2 h-8 w-8 p-0"
                  >
                    <Navigation className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveSidebar;
