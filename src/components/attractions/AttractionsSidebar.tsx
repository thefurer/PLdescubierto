import { useState, useEffect } from "react";
import { TouristAttraction } from "@/types/touristAttractions";
import { MapPin, X, ZoomIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

interface AttractionsSidebarProps {
  selectedAttraction: TouristAttraction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AttractionsSidebar = ({ selectedAttraction, isOpen, onClose }: AttractionsSidebarProps) => {
  const [mapCenter, setMapCenter] = useState("Puerto López, Manabí, Ecuador");
  const [mapCoordinates, setMapCoordinates] = useState("-1.5667,-80.7833");
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  useEffect(() => {
    if (selectedAttraction?.name) {
      setMapCenter(`${selectedAttraction.name}, Puerto López, Manabí, Ecuador`);
      
      // Si la atracción tiene coordenadas específicas, usarlas
      if (selectedAttraction.coordinates) {
        setMapCoordinates(`${selectedAttraction.coordinates.lat},${selectedAttraction.coordinates.lng}`);
      } else {
        // Usar coordenadas por defecto de Puerto López
        setMapCoordinates("-1.5667,-80.7833");
      }
    }
  }, [selectedAttraction]);

  useEffect(() => {
    const getMapEmbedUrl = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('google-maps-embed', {
          body: {
            location: mapCenter,
            center: mapCoordinates
          }
        });

        if (error) throw error;
        setMapEmbedUrl(data.embedUrl);
      } catch (error) {
        console.error('Error loading map:', error);
        // Fallback to basic map without API key
        setMapEmbedUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.344!2d-80.7833!3d-1.5667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMzQnMDAuMSJTIDgwwrA0NicwMC4wIlc!5e0!3m2!1sen!2s!4v1234567890');
      }
    };

    getMapEmbedUrl();
  }, [mapCenter, mapCoordinates]);

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
              <div className="flex items-center gap-2 text-sm text-ocean-dark mb-2">
                <span className="font-medium">Categoría:</span>
                <span className="px-2 py-1 bg-green-light/20 rounded-full text-xs">
                  {selectedAttraction.category}
                </span>
              </div>
              {selectedAttraction.coordinates && (
                <div className="flex items-center gap-2 text-sm text-ocean-dark">
                  <span className="font-medium">Coordenadas:</span>
                  <span className="text-xs text-gray-600">
                    {selectedAttraction.coordinates.lat.toFixed(4)}, {selectedAttraction.coordinates.lng.toFixed(4)}
                  </span>
                </div>
              )}
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
                onClick={() => {
                  const coordinates = selectedAttraction?.coordinates 
                    ? `${selectedAttraction.coordinates.lat},${selectedAttraction.coordinates.lng}` 
                    : `${mapCenter}`;
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(coordinates)}`, '_blank');
                }}
                className="text-xs"
              >
                <ZoomIn size={14} className="mr-1" />
                Ver más
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-lg border border-gray-200">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-lg">
                  <p className="text-gray-600">Cargando mapa...</p>
                </div>
              )}
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