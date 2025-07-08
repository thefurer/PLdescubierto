
import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, DollarSign, Camera, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface TravelPoint {
  id: string;
  name: string;
  description: string;
  category: 'tours' | 'playas' | 'cultura' | 'aventura';
  rating: number;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil' | 'Muy Fácil';
  duration: string;
  price: string;
  bestTime: string;
  highlights: string[];
  image: string;
  coordinates?: { lat: number; lng: number };
}

// Default travel points that will be used if no data exists in database
const defaultTravelPoints: TravelPoint[] = [
  {
    id: '1',
    name: 'Avistamiento de Ballenas',
    category: 'tours',
    description: 'Experiencia única para observar ballenas jorobadas durante su migración anual.',
    highlights: ['Ballenas jorobadas', 'Delfines', 'Aves marinas', 'Fotografía'],
    duration: '3-4 horas',
    price: '$25-40',
    bestTime: 'Junio - Septiembre',
    difficulty: 'Fácil',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -1.5667, lng: -80.7833 }
  },
  {
    id: '2',
    name: 'Isla de la Plata',
    category: 'tours',
    description: 'Conocida como las "Galápagos Pobres", perfecta para snorkeling y observación de vida marina.',
    highlights: ['Snorkeling', 'Piqueros de patas azules', 'Fragatas', 'Tortugas marinas'],
    duration: '6-8 horas',
    price: '$35-50',
    bestTime: 'Todo el año',
    difficulty: 'Moderado',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -1.2833, lng: -81.0833 }
  },
  {
    id: '3',
    name: 'Playa Los Frailes',
    category: 'playas',
    description: 'Una de las playas más hermosas del Ecuador, con arena dorada y aguas cristalinas.',
    highlights: ['Arena dorada', 'Aguas cristalinas', 'Senderos naturales', 'Miradores'],
    duration: '2-3 horas',
    price: '$5 entrada',
    bestTime: 'Todo el año',
    difficulty: 'Fácil',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -1.5667, lng: -80.6833 }
  },
  {
    id: '4',
    name: 'Agua Blanca',
    category: 'cultura',
    description: 'Sitio arqueológico con aguas termales sulfurosas y museo de la cultura Manteña.',
    highlights: ['Museo arqueológico', 'Aguas termales', 'Cultura Manteña', 'Senderos'],
    duration: '3-4 horas',
    price: '$10-15',
    bestTime: 'Todo el año',
    difficulty: 'Fácil',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -1.5167, lng: -80.7167 }
  },
  {
    id: '5',
    name: 'Playa de Puerto López',
    category: 'playas',
    description: 'Playa principal del pueblo pesquero, perfecta para disfrutar de la puesta de sol.',
    highlights: ['Atardeceres', 'Restaurantes frente al mar', 'Pesca artesanal', 'Mercado de mariscos'],
    duration: '1-2 horas',
    price: 'Gratis',
    bestTime: 'Todo el año',
    difficulty: 'Muy Fácil',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -1.5667, lng: -80.7833 }
  },
  {
    id: '6',
    name: 'Sendero La Playita',
    category: 'aventura',
    description: 'Caminata costera que conecta varias playas vírgenes con vista panorámica al océano.',
    highlights: ['Playas vírgenes', 'Acantilados', 'Flora nativa', 'Vistas panorámicas'],
    duration: '2-3 horas',
    price: '$5 entrada',
    bestTime: 'Mañana temprano',
    difficulty: 'Moderado',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: -1.5500, lng: -80.6900 }
  }
];

const TravelGuidePoints = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [travelPoints, setTravelPoints] = useState<TravelPoint[]>(defaultTravelPoints);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTravelPoints();
  }, []);

  const loadTravelPoints = async () => {
    try {
      const { data } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_name', 'travel_guide_points')
        .single();

      if (data?.content && typeof data.content === 'object' && data.content !== null) {
        const content = data.content as any;
        if (content.points && Array.isArray(content.points)) {
          setTravelPoints(content.points);
        }
      }
    } catch (error) {
      console.error('Error loading travel points:', error);
      // Keep default points if loading fails
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'Todos', color: 'bg-blue-500' },
    { value: 'tours', label: 'Tours', color: 'bg-green-500' },
    { value: 'playas', label: 'Playas', color: 'bg-cyan-500' },
    { value: 'cultura', label: 'Cultura', color: 'bg-purple-500' },
    { value: 'aventura', label: 'Aventura', color: 'bg-orange-500' }
  ];

  const filteredPoints = travelPoints.filter(point => 
    selectedCategory === 'all' || point.category === selectedCategory
  );

  const handleGetDirections = (coordinates: { lat: number; lng: number } | undefined, name: string) => {
    if (!coordinates) return;
    const coordString = `${coordinates.lat},${coordinates.lng}`;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordString}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Muy Fácil': return 'bg-green-100 text-green-800';
      case 'Fácil': return 'bg-blue-100 text-blue-800';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-ocean-dark mb-4">
            Puntos de Interés en Puerto López
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre los lugares más emblemáticos y experiencias únicas que Puerto López tiene para ofrecer
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant="outline"
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                selectedCategory === category.value
                  ? `${category.color} text-white hover:opacity-90`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPoints.map((point) => (
            <Card key={point.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={point.image}
                  alt={point.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-semibold text-sm">{point.rating}</span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(point.difficulty)}`}>
                    {point.difficulty}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-ocean-dark flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  {point.name}
                </CardTitle>
                <p className="text-gray-600">{point.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="flex items-center">
                     <Clock className="h-4 w-4 mr-2 text-gray-500" />
                     <span>{point.duration}</span>
                   </div>
                   <div className="flex items-center">
                     <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                     <span>{point.price}</span>
                   </div>
                 </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-2">Mejor época:</p>
                  <p className="text-sm text-blue-700">{point.bestTime}</p>
                </div>
                
                <div>
                  <p className="font-medium text-gray-800 mb-2 flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Qué verás:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {point.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                
                 <Button
                   onClick={() => handleGetDirections(point.coordinates, point.name)}
                   className="w-full bg-gradient-to-r from-ocean to-blue-600 hover:from-ocean-dark hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                   disabled={!point.coordinates}
                 >
                   <Waves className="h-4 w-4 mr-2" />
                   Ver en Mapa
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelGuidePoints;
