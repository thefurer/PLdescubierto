
import { useState } from 'react';
import { ArrowLeft, MapPin, Car, Plane, Bus, Clock, Navigation, Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const TravelGuide = () => {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState('');
  const [hoveredTransport, setHoveredTransport] = useState<number | null>(null);

  const destinations = [
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

  const transportOptions = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: 'Por Avión',
      description: 'Vuela a Manta (1 hora desde Quito) + 1.5 horas en bus/auto',
      duration: '2.5 horas total',
      cost: '$80 - $150',
      pros: ['Más rápido', 'Cómodo'],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <Bus className="h-8 w-8" />,
      title: 'Por Bus',
      description: 'Bus directo desde Quito, Guayaquil o Cuenca',
      duration: '6-8 horas desde Quito',
      cost: '$8 - $15',
      pros: ['Económico', 'Directo'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Por Auto',
      description: 'Ruta escénica por la costa del Pacífico',
      duration: '5-6 horas desde Quito',
      cost: '$40 - $60 (gasolina)',
      pros: ['Flexible', 'Paisajes'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleGetDirections = (destination: string) => {
    const destination_coords = destinations.find(d => d.name === destination)?.coords || '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination_coords}&destination_place_id=${encodeURIComponent(destination)}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section - Solid background without right gradient */}
      <div className="relative overflow-hidden bg-ocean">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8 animate-fade-in">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Compass className="h-12 w-12 text-white mr-4 animate-pulse" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  Guía de Viaje
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                Todo lo que necesitas saber para llegar a Puerto López
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <MapPin className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">Explora destinos únicos en Ecuador</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          {/* Interactive Map Section */}
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

              {/* Enhanced Google Map */}
              <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.344!2d-80.7833!3d-1.5667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902e0c0a0a0a0a0a%3A0x0a0a0a0a0a0a0a0a!2sPuerto%20L%C3%B3pez%2C%20Ecuador!5e0!3m2!1ses!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de Puerto López"
                  className="hover:scale-105 transition-transform duration-700"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Transportation Options */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-center mb-4 text-ocean-dark">Opciones de Transporte</h2>
            <p className="text-xl text-center text-gray-600 mb-10">Elige la opción que mejor se adapte a tu viaje</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {transportOptions.map((option, index) => (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                    hoveredTransport === index ? 'shadow-2xl' : 'shadow-lg'
                  } glass-card border-0`}
                  onMouseEnter={() => setHoveredTransport(index)}
                  onMouseLeave={() => setHoveredTransport(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-10 transition-opacity duration-300 ${
                    hoveredTransport === index ? 'opacity-20' : ''
                  }`}></div>
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className={`mx-auto mb-6 p-6 bg-gradient-to-br ${option.color} rounded-full w-fit shadow-lg transform transition-all duration-300 ${
                      hoveredTransport === index ? 'scale-110 rotate-12' : ''
                    }`}>
                      <div className="text-white">
                        {option.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-ocean-dark">{option.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center relative z-10">
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{option.description}</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center text-lg">
                        <Clock className="h-5 w-5 mr-2 text-green-500" />
                        <span className="font-semibold">{option.duration}</span>
                      </div>
                      <div className="text-2xl font-bold text-ocean-dark">{option.cost}</div>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {option.pros.map((pro, proIndex) => (
                          <span 
                            key={proIndex}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {pro}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enhanced Travel Tips */}
          <Card className="glass-card border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-primary to-ocean text-white rounded-t-lg">
              <CardTitle className="text-3xl font-bold">Consejos de Viaje</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-ocean">
                    <h4 className="text-xl font-bold mb-4 text-ocean-dark flex items-center">
                      <Star className="h-6 w-6 mr-2 text-yellow-500" />
                      Mejor época para visitar
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <strong className="text-ocean">Junio - Septiembre:</strong> Temporada de ballenas jorobadas
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <strong className="text-ocean">Diciembre - Abril:</strong> Clima seco y soleado
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-primary">
                    <h4 className="text-xl font-bold mb-4 text-green-dark flex items-center">
                      <Compass className="h-6 w-6 mr-2 text-green-primary" />
                      Qué llevar
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        'Protector solar y sombrero',
                        'Ropa cómoda y zapatos de caminata',
                        'Cámara impermeable',
                        'Repelente de insectos'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="w-2 h-2 bg-green-primary rounded-full mr-3"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default TravelGuide;
