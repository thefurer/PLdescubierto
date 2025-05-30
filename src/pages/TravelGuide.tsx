
import { useState } from 'react';
import { ArrowLeft, MapPin, Car, Plane, Bus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TravelGuide = () => {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState('');

  const destinations = [
    { name: 'Playa Los Frailes', coords: '-1.5667, -80.6833', description: 'Playa paradisíaca en el Parque Nacional Machalilla' },
    { name: 'Isla de la Plata', coords: '-1.2833, -81.0833', description: 'Tour de observación de ballenas y aves' },
    { name: 'Agua Blanca', coords: '-1.5167, -80.7167', description: 'Sitio arqueológico y aguas termales' },
    { name: 'Playa de Puerto López', coords: '-1.5667, -80.7833', description: 'Playa principal del pueblo pesquero' },
  ];

  const transportOptions = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: 'Por Avión',
      description: 'Vuela a Manta (1 hora desde Quito) + 1.5 horas en bus/auto',
      duration: '2.5 horas total',
      cost: '$80 - $150'
    },
    {
      icon: <Bus className="h-6 w-6" />,
      title: 'Por Bus',
      description: 'Bus directo desde Quito, Guayaquil o Cuenca',
      duration: '6-8 horas desde Quito',
      cost: '$8 - $15'
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: 'Por Auto',
      description: 'Ruta escénica por la costa del Pacífico',
      duration: '5-6 horas desde Quito',
      cost: '$40 - $60 (gasolina)'
    }
  ];

  const handleGetDirections = (destination: string) => {
    const destination_coords = destinations.find(d => d.name === destination)?.coords || '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination_coords}&destination_place_id=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-ocean-dark">Guía de Viaje</h1>
              <p className="text-gray-600 mt-2">Todo lo que necesitas saber para llegar a Puerto López</p>
            </div>
          </div>

          {/* Interactive Map */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-500" />
                Mapa Interactivo de Puerto López
              </CardTitle>
              <CardDescription>
                Explora los principales destinos y obtén direcciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Selecciona un destino:</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg"
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
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-ocean-dark">{selectedDestination}</h3>
                  <p className="text-gray-600 mb-3">
                    {destinations.find(d => d.name === selectedDestination)?.description}
                  </p>
                  <Button 
                    onClick={() => handleGetDirections(selectedDestination)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Obtener Direcciones
                  </Button>
                </div>
              )}

              {/* Embedded Google Map */}
              <div className="w-full h-96 rounded-lg overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.344!2d-80.7833!3d-1.5667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902e0c0a0a0a0a0a%3A0x0a0a0a0a0a0a0a0a!2sPuerto%20L%C3%B3pez%2C%20Ecuador!5e0!3m2!1ses!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de Puerto López"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Transportation Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {transportOptions.map((option, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    {option.icon}
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-green-500" />
                      {option.duration}
                    </div>
                    <div className="font-semibold text-ocean-dark">{option.cost}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Travel Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Consejos de Viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-ocean-dark">Mejor época para visitar</h4>
                  <p className="text-gray-600 mb-4">
                    Junio a septiembre: Temporada de ballenas jorobadas
                    <br />
                    Diciembre a abril: Clima seco y soleado
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-ocean-dark">Qué llevar</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Protector solar y sombrero</li>
                    <li>• Ropa cómoda y zapatos de caminata</li>
                    <li>• Cámara impermeable</li>
                    <li>• Repelente de insectos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TravelGuide;
