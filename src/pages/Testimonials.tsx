
import { useState } from 'react';
import { ArrowLeft, Star, Quote, Heart, Users, MapPin, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const Testimonials = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const testimonials = [
    {
      id: '1',
      name: 'María Rodríguez',
      date: '15 de Septiembre, 2024',
      location: 'Quito, Ecuador',
      rating: 5,
      comment: '¡Puerto López es un paraíso! Los tours de avistamiento de ballenas son increíbles y la gente es muy amable. Definitivamente regresaré el próximo año con toda mi familia.',
      category: 'familia',
      image: 'https://images.unsplash.com/photo-1552058544-f9e740c2ca6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      experience: 'Tour de Ballenas'
    },
    {
      id: '2',
      name: 'John Smith',
      date: '10 de Agosto, 2024',
      location: 'New York, USA',
      rating: 5,
      comment: 'The beaches are absolutely stunning and the sunsets are breathtaking. I highly recommend visiting Isla de la Plata - it\'s like the Galápagos but more accessible!',
      category: 'aventura',
      image: 'https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      experience: 'Isla de la Plata'
    },
    {
      id: '3',
      name: 'Ana Gómez',
      date: '2 de Julio, 2024',
      location: 'Madrid, España',
      rating: 5,
      comment: 'La gastronomía es deliciosa y los precios son muy accesibles. El ceviche fresco y el pescado a la plancha son imperdibles. ¡Volveré pronto con mi pareja!',
      category: 'pareja',
      image: 'https://images.unsplash.com/photo-1544006659-f0b21884cebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      experience: 'Gastronomía Local'
    },
    {
      id: '4',
      name: 'Carlos Pérez',
      date: '20 de Junio, 2024',
      location: 'Buenos Aires, Argentina',
      rating: 4,
      comment: 'Un lugar tranquilo y seguro para disfrutar en familia. La playa de Los Frailes es espectacular y los niños se divirtieron mucho. Excelente atención en todos los restaurantes.',
      category: 'familia',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      experience: 'Playa Los Frailes'
    },
    {
      id: '5',
      name: 'Emily White',
      date: '5 de Mayo, 2024',
      location: 'London, UK',
      rating: 5,
      comment: 'The wildlife is absolutely amazing! We saw humpback whales, dolphins, and countless birds. A must-see destination for nature lovers and photographers.',
      category: 'aventura',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b82bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      experience: 'Vida Marina'
    },
    {
      id: '6',
      name: 'Sophie Dubois',
      date: '12 de Abril, 2024',
      location: 'Paris, France',
      rating: 5,
      comment: 'Un endroit magnifique pour se détendre et profiter de la nature. Les plages sont propres, l\'eau est claire et les couchers de soleil sont inoubliables.',
      category: 'pareja',
      image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      experience: 'Playas y Atardeceres'
    },
    {
      id: '7',
      name: 'Diego Morales',
      date: '28 de Marzo, 2024',
      location: 'Medellín, Colombia',
      rating: 4,
      comment: 'Excelente destino para desconectarse. El tour a Agua Blanca fue muy educativo y relajante. Las aguas termales son perfectas después de caminar por los senderos.',
      category: 'aventura',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      experience: 'Agua Blanca'
    },
    {
      id: '8',
      name: 'Isabella Torres',
      date: '15 de Febrero, 2024',
      location: 'Lima, Perú',
      rating: 5,
      comment: 'Mi luna de miel en Puerto López fue perfecta. Los atardeceres en la playa principal son mágicos y la hospitalidad de la gente local es increíble.',
      category: 'pareja',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      experience: 'Luna de Miel'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todos', color: 'bg-blue-500', icon: Users },
    { value: 'familia', label: 'Familia', color: 'bg-green-500', icon: Heart },
    { value: 'pareja', label: 'Pareja', color: 'bg-pink-500', icon: Heart },
    { value: 'aventura', label: 'Aventura', color: 'bg-orange-500', icon: Star }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => 
    selectedCategory === 'all' || testimonial.category === selectedCategory
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600">
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
                Volver al Inicio
              </Button>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-white mr-4 animate-pulse" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  Testimonios
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                Descubre por qué nuestros visitantes se enamoran de Puerto López
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Quote className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">Experiencias Reales</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                <Filter className="h-8 w-8 mr-3 text-purple-600" />
                Filtra por Experiencia
              </h2>
              <p className="text-gray-600">Encuentra testimonios según el tipo de viaje</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.value}
                    variant="outline"
                    className={`rounded-full px-6 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.value
                        ? `${category.color} text-white hover:opacity-90 shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                    }`}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center z-10">
                    <div className="flex items-center">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full">
                      {testimonial.experience}
                    </span>
                  </div>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={`Foto de ${testimonial.name}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                    <Quote className="h-5 w-5 mr-2 text-purple-500" />
                    {testimonial.name}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {testimonial.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {testimonial.date}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-base italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl">No hay testimonios para esta categoría</p>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-0 shadow-lg text-center p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Visitantes Felices</div>
            </Card>
            <Card className="glass-card border-0 shadow-lg text-center p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">4.8</div>
              <div className="text-gray-600">Calificación Promedio</div>
            </Card>
            <Card className="glass-card border-0 shadow-lg text-center p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Recomendarían</div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Testimonials;
