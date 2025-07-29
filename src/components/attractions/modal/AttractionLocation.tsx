import { useState, useEffect } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TouristAttraction } from "@/types/touristAttractions";
import { supabase } from '@/integrations/supabase/client';

interface AttractionLocationProps {
  attraction: TouristAttraction;
}

export const AttractionLocation = ({ attraction }: AttractionLocationProps) => {
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMapEmbedUrl = async () => {
      try {
        setLoading(true);
        
        // Determinar la ubicación y coordenadas para el mapa
        const location = `${attraction.name}, Puerto López, Manabí, Ecuador`;
        const coordinates = attraction.coordinates 
          ? `${attraction.coordinates.lat},${attraction.coordinates.lng}`
          : '-1.5667,-80.7833'; // Coordenadas por defecto de Puerto López

        const { data, error } = await supabase.functions.invoke('google-maps-embed', {
          body: {
            location: location,
            center: coordinates
          }
        });

        if (error) throw error;
        setMapEmbedUrl(data.embedUrl);
      } catch (error) {
        console.error('Error loading map:', error);
        // Fallback to basic map without API key
        setMapEmbedUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.344!2d-80.7833!3d-1.5667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMzQnMDAuMSJTIDgwwrA0NicwMC4wIlc!5e0!3m2!1sen!2s!4v1234567890');
      } finally {
        setLoading(false);
      }
    };

    getMapEmbedUrl();
  }, [attraction]);

  const handleOpenInGoogleMaps = () => {
    if (attraction.coordinates) {
      const url = `https://maps.google.com/?q=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://maps.google.com/?q=${encodeURIComponent(`${attraction.name}, Puerto López, Manabí, Ecuador`)}`;
      window.open(url, '_blank');
    }
  };

  const handleGetDirections = () => {
    if (attraction.coordinates) {
      const url = `https://maps.google.com/maps/dir/?api=1&destination=${attraction.coordinates.lat},${attraction.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://maps.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${attraction.name}, Puerto López, Manabí, Ecuador`)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Información de ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ocean">
            <MapPin className="h-5 w-5" />
            Ubicación de {attraction.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-ocean-dark mb-2">Dirección</h4>
              <p className="text-gray-600">
                {attraction.name}, Puerto López, Manabí, Ecuador
              </p>
            </div>
            
            {attraction.coordinates && (
              <div>
                <h4 className="font-semibold text-ocean-dark mb-2">Coordenadas</h4>
                <p className="text-gray-600 font-mono text-sm">
                  {attraction.coordinates.lat.toFixed(6)}, {attraction.coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleOpenInGoogleMaps}
              variant="outline"
              className="flex items-center gap-2 border-ocean text-ocean hover:bg-ocean hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              Ver en Google Maps
            </Button>
            
            <Button
              onClick={handleGetDirections}
              className="flex items-center gap-2 bg-gradient-to-r from-ocean to-blue-600 hover:from-ocean-dark hover:to-blue-700 text-white"
            >
              <MapPin className="h-4 w-4" />
              Obtener Direcciones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mapa embebido */}
      <Card>
        <CardHeader>
          <CardTitle className="text-ocean">Mapa Interactivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border-2 border-ocean-light">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto mb-2"></div>
                  <p className="text-gray-600">Cargando mapa...</p>
                </div>
              </div>
            ) : mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${attraction.name}`}
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-gray-600">Error al cargar el mapa</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-gradient-to-br from-ocean-light/10 to-green-light/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-semibold text-ocean mb-2">
              🌊 Provincia de Manabí, Ecuador
            </h4>
            <p className="text-sm text-gray-600">
              Descubre la provincia costera más hermosa de Ecuador con sus playas vírgenes, 
              vida marina extraordinaria y culturas ancestrales que te esperan en cada rincón.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};