
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

interface TravelGuidePointsPreviewProps {
  points: TravelPoint[];
}

const TravelGuidePointsPreview = ({ points }: TravelGuidePointsPreviewProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Muy Fácil': return 'bg-green-100 text-green-800';
      case 'Fácil': return 'bg-blue-100 text-blue-800';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { value: 'all', label: 'Todos', color: 'bg-blue-500' },
    { value: 'tours', label: 'Tours', color: 'bg-green-500' },
    { value: 'playas', label: 'Playas', color: 'bg-cyan-500' },
    { value: 'cultura', label: 'Cultura', color: 'bg-purple-500' },
    { value: 'aventura', label: 'Aventura', color: 'bg-orange-500' }
  ];

  return (
    <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-green-50">
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
                category.value === 'all'
                  ? `${category.color} text-white`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Points Grid Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.slice(0, 6).map((point) => (
            <Card key={point.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative overflow-hidden">
                {point.image ? (
                  <img
                    src={point.image}
                    alt={point.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                  </div>
                )}
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
                
                {point.highlights && point.highlights.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Qué verás:</p>
                    <div className="flex flex-wrap gap-2">
                      {point.highlights.slice(0, 3).map((highlight, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelGuidePointsPreview;
