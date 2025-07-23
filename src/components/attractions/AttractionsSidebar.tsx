import { useState, useEffect } from "react";
import { TouristAttraction } from "@/types/touristAttractions";
import { MapPin, X, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AttractionsSidebarProps {
  selectedAttraction: TouristAttraction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttractionsSidebar = ({ selectedAttraction, isOpen, onClose }: AttractionsSidebarProps) => {
  const [mapCenter, setMapCenter] = useState("Puerto López, Manabí, Ecuador");

  useEffect(() => {
    if (selectedAttraction?.name) {
      setMapCenter(`${selectedAttraction.name}, Puerto López, Manabí, Ecuador`);
    }
  }, [selectedAttraction]);

  const getEmbedUrl = () => {
    const encodedLocation = encodeURIComponent(mapCenter);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dM2_WvbSn-VKo4&q=${encodedLocation}&zoom=14&maptype=roadmap`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-ocean-light to-green-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-ocean" size={20} />
            <h3 className="font-semibold text-ocean">Mapa Interactivo</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-ocean hover:bg-white/20"
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 h-full overflow-y-auto">
        {/* Location Info */}
        {selectedAttraction && (
          <Card className="border-ocean-light">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-ocean flex items-center gap-2">
                <MapPin size={16} />
                {selectedAttraction.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                {selectedAttraction.description?.substring(0, 100)}...
              </p>
              <div className="flex items-center gap-2 text-sm text-ocean-dark">
                <span className="font-medium">Categoría:</span>
                <span className="px-2 py-1 bg-green-light/20 rounded-full text-xs">
                  {selectedAttraction.category}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        <Card className="border-ocean-light">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-ocean">
                Ubicación en Manabí
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(mapCenter)}`, '_blank')}
                className="text-xs"
              >
                <ZoomIn size={14} className="mr-1" />
                Ver más
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg border border-gray-200">
              <iframe
                src={getEmbedUrl()}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="border-green-light bg-gradient-to-br from-green-light/10 to-ocean-light/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <h4 className="font-semibold text-ocean mb-2">
                🌊 Manabí, Ecuador
              </h4>
              <p className="text-sm text-gray-600">
                Descubre la provincia costera más hermosa de Ecuador con sus playas vírgenes, 
                vida marina extraordinaria y culturas ancestrales.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-ocean text-ocean hover:bg-ocean hover:text-white"
            onClick={() => window.open('https://maps.google.com/?q=Puerto+López,+Manabí,+Ecuador', '_blank')}
          >
            Ver Puerto López
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-green text-green hover:bg-green hover:text-white"
            onClick={() => window.open('https://maps.google.com/?q=Manabí,+Ecuador', '_blank')}
          >
            Ver Manabí
          </Button>
        </div>
      </div>
    </div>
  );
};