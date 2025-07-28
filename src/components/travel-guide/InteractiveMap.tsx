
import { useState, useEffect } from 'react';
import { MapPin, Navigation, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface Destination {
  name: string;
  coords: string;
  description: string;
  rating: number;
  difficulty: string;
}

const destinations: Destination[] = [
  { 
    name: 'Playa Los Frailes', 
    coords: '-1.5667, -80.6833', 
    description: 'Playa paradisíaca en el Parque Nacional Machalilla',
    rating: 4.9,
    difficulty: 'Fácil'
  },
  { 
    name: 'Isla de la Plata', 
    coords: '-1.2833, -81.0833', 
    description: 'Tour de observación de ballenas y aves',
    rating: 4.8,
    difficulty: 'Moderado'
  },
  { 
    name: 'Agua Blanca', 
    coords: '-1.5167, -80.7167', 
    description: 'Sitio arqueológico y aguas termales',
    rating: 4.6,
    difficulty: 'Fácil'
  },
  { 
    name: 'Playa de Puerto López', 
    coords: '-1.5667, -80.7833', 
    description: 'Playa principal del pueblo pesquero',
    rating: 4.7,
    difficulty: 'Muy Fácil'
  },
];

const InteractiveMap = () => {
  const [selectedDestination, setSelectedDestination] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');

  useEffect(() => {
    const getMapEmbedUrl = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('google-maps-embed', {
          body: {
            location: 'Puerto López, Ecuador',
            center: '-1.5667,-80.7833'
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
  }, []);

  const handleGetDirections = (destination: string) => {
    const destination_coords = destinations.find(d => d.name === destination)?.coords || '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination_coords}&destination_place_id=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <Card className="mb-12 glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in">
      <CardHeader className="bg-gradient-to-r from-ocean to-green-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center text-2xl">
          <MapPin className="h-6 w-6 mr-3 animate-bounce" />
          Mapa Interactivo de Puerto López
        </CardTitle>
        <CardDescription className="text-blue-100">
          Explora los principales destinos y obtén direcciones
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4 text-ocean-dark">Selecciona un destino:</label>
          <select 
            className="w-full p-4 border-2 border-ocean-light rounded-xl text-lg focus:border-ocean focus:ring-4 focus:ring-ocean-light/20 transition-all duration-300"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
          >
            <option value="">Elige un destino...</option>
            {destinations.map((dest) => (
              <option key={dest.name} value={dest.name}>{dest.name}</option>
            ))}
          </select>
        </div>

        {selectedDestination && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-l-4 border-ocean animate-slide-in-right">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-ocean-dark mb-2">{selectedDestination}</h3>
                <p className="text-gray-700 text-lg mb-4">
                  {destinations.find(d => d.name === selectedDestination)?.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold text-lg">
                    {destinations.find(d => d.name === selectedDestination)?.rating}
                  </span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {destinations.find(d => d.name === selectedDestination)?.difficulty}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => handleGetDirections(selectedDestination)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Obtener Direcciones
            </Button>
          </div>
        )}

        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Puerto López"
              className="hover:scale-105 transition-transform duration-700"
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-600">Cargando mapa...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
