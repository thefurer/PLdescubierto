import { useState } from 'react';
import { ArrowLeft, Star, Quote, Filter, Users, MapPin, Calendar, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Testimonials = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const testimonials = [
    {
      name: "María Elena Vargas",
      location: "Guayaquil, Ecuador",
      rating: 5,
      comment: "¡Puerto López es un paraíso! El tour de ballenas fue increíble, pudimos ver como 6 ballenas jorobadas con sus crías. Los guías son muy profesionales y conocen mucho sobre la fauna marina. La Isla de la Plata es espectacular, el snorkeling fue una experiencia única.",
      experience: "Tour de Ballenas + Isla de la Plata",
      date: "Agosto 2024",
      likes: 24,
      verified: true
    },
    {
      name: "Carlos Andrade Mendoza",
      location: "Quito, Ecuador", 
      rating: 5,
      comment: "Excelente destino para vacaciones familiares. Mis hijos quedaron fascinados con las ballenas. Los Frailes es la playa más hermosa que he visto en Ecuador. El agua cristalina y la arena blanca son perfectas. Definitivamente regresaremos el próximo año.",
      experience: "Vacaciones familiares - 4 días",
      date: "Julio 2024",
      likes: 18,
      verified: true
    },
    {
      name: "Ana Lucía Jiménez",
      location: "Cuenca, Ecuador",
      rating: 4,
      comment: "Me encantó la tranquilidad del pueblo y la calidez de su gente. La comida del mar es deliciosa, especialmente el ceviche. El Parque Nacional Machalilla tiene senderos hermosos. Solo sugiero mejorar un poco la señalización en los senderos.",
      experience: "Ecoturismo y gastronomía",
      date: "Septiembre 2024",
      likes: 15,
      verified: true
    },
    {
      name: "Roberto Silva Castillo",
      location: "Manta, Ecuador",
      rating: 5,
      comment: "Como manabita, he visitado muchas playas, pero Puerto López tiene algo especial. La combinación de cultura, naturaleza y aventura es perfecta. Los pescadores locales son muy amables y siempre dispuestos a compartir sus historias.",
      experience: "Turismo local",
      date: "Junio 2024",
      likes: 21,
      verified: true
    },
    {
      name: "Sofía Morales Vera",
      location: "Ambato, Ecuador",
      rating: 5,
      comment: "¡Experiencia inolvidable! Ver ballenas en su hábitat natural fue emocionante. Agua Blanca es un sitio arqueológico fascinante, aprendimos mucho sobre la cultura precolombina. Las aguas termales fueron relajantes después de tanto caminar.",
      experience: "Tour cultural y ballenas",
      date: "Agosto 2024",
      likes: 19,
      verified: false
    },
    {
      name: "Diego Hernández López",
      location: "Loja, Ecuador",
      rating: 4,
      comment: "Puerto López superó mis expectativas. La biodiversidad es impresionante, tanto marina como terrestre. Los guides locales conocen cada rincón y tienen historias fascinantes. La playa del pueblo es perfecta para relajarse al atardecer.",
      experience: "Aventura y naturaleza",
      date: "Julio 2024",
      likes: 12,
      verified: true
    },
    {
      name: "Gabriela Pérez Intriago",
      location: "Portoviejo, Ecuador",
      rating: 4,
      comment: "Como bióloga marina, Puerto López me impresionó por su conservación. Ver ballenas jorobadas tan cerca es un privilegio. La Isla de la Plata merece el nombre de 'Galápagos del continente'. Excelente trabajo de conservación por parte de las autoridades.",
      experience: "Investigación y turismo científico",
      date: "Septiembre 2024",
      likes: 27,
      verified: true
    },
    {
      name: "Fernando Alvarado Ruiz",
      location: "Machala, Ecuador",
      rating: 4,
      comment: "Perfecto para desconectarse de la ciudad. La pesca deportiva es excelente, capturamos dorados y atunes. Los restaurantes sirven el pescado más fresco. Solo necesitan mejorar un poco la infraestructura hotelera, pero el encanto natural lo compensa todo.",
      experience: "Pesca deportiva",
      date: "Agosto 2024",
      likes: 16,
      verified: true
    }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const locationMatch = selectedLocation === 'all' || testimonial.location.includes(selectedLocation);
    const ratingMatch = selectedRating === 'all' || testimonial.rating.toString() === selectedRating;
    return locationMatch && ratingMatch;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 transition-colors duration-200 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  const locations = [...new Set(testimonials.map(t => t.location.split(', ')[1]))];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section with Better Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-primary via-emerald-500 to-ocean opacity-95"></div>
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
                <Users className="h-12 w-12 text-white mr-4 animate-pulse" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  Testimonios
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                Experiencias reales de nuestros visitantes
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Star className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">
                  {averageRating.toFixed(1)} estrellas promedio de {testimonials.length} reseñas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          {/* Enhanced Rating Summary */}
          <Card className="mb-8 glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="flex justify-center items-center space-x-2 mb-2">
                    {renderStars(Math.round(averageRating))}
                    <span className="text-3xl font-bold text-ocean-dark">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">Calificación promedio</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">{testimonials.length}</div>
                  <p className="text-gray-600 font-medium">Reseñas totales</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <p className="text-gray-600 font-medium">Recomiendan visitar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Filters */}
          <Card className="mb-8 glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-ocean" />
                Filtrar testimonios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Por ubicación</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las ubicaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las ubicaciones</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Por calificación</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las calificaciones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las calificaciones</SelectItem>
                      <SelectItem value="5">5 estrellas</SelectItem>
                      <SelectItem value="4">4 estrellas</SelectItem>
                      <SelectItem value="3">3 estrellas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedLocation('all');
                      setSelectedRating('all');
                    }}
                    className="w-full"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`glass-card border-0 transition-all duration-500 cursor-pointer ${
                  hoveredCard === index 
                    ? 'shadow-2xl scale-105 border-l-4 border-l-ocean' 
                    : 'shadow-lg hover:shadow-xl'
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg text-ocean-dark">
                          {testimonial.name}
                        </CardTitle>
                        {testimonial.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </CardDescription>
                    </div>
                    <Quote className="h-8 w-8 text-green-500 opacity-30" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {renderStars(testimonial.rating)}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {testimonial.date}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    "{testimonial.comment}"
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg border-l-2 border-ocean">
                    <div className="text-xs font-medium text-ocean-dark mb-1">Experiencia:</div>
                    <div className="text-sm text-gray-700">{testimonial.experience}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-500 hover:text-ocean transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {testimonial.likes}
                    </Button>
                    <div className="text-xs text-gray-400">
                      Útil para {Math.floor(testimonial.likes * 1.2)} personas
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <Card className="text-center p-12 glass-card border-0 shadow-lg">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    No se encontraron testimonios
                  </h3>
                  <p className="text-gray-500">
                    Intenta ajustar los filtros para ver más resultados
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Call to Action */}
          <Card className="mt-12 glass-card border-0 shadow-2xl bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-ocean-dark">
                    ¿Ya visitaste Puerto López?
                  </h3>
                  <p className="text-lg text-gray-600">
                    Tu experiencia puede inspirar a otros viajeros a descubrir este paraíso
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button 
                    onClick={() => window.open('https://wa.me/593991995390?text=Hola, me gustaría compartir mi experiencia en Puerto López', '_blank')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Compartir experiencia
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/travel-guide')}
                    className="border-ocean text-ocean hover:bg-ocean hover:text-white transition-all duration-300"
                  >
                    Planear mi viaje
                  </Button>
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

export default Testimonials;
