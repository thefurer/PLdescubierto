import { useState } from 'react';
import { ArrowLeft, Star, Quote, Heart, Users, MapPin, Calendar } from 'lucide-react';
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
      comment: '¡Puerto López es un paraíso! Los tours de avistamiento de ballenas son increíbles y la gente es muy amable.',
      category: 'familia',
      image: 'https://images.unsplash.com/photo-1552058544-f9e740c2ca6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '2',
      name: 'John Smith',
      date: '10 de Agosto, 2024',
      location: 'New York, USA',
      rating: 4,
      comment: 'The beaches are beautiful and the sunsets are breathtaking. I highly recommend visiting Isla de la Plata.',
      category: 'aventura',
      image: 'https://images.unsplash.com/photo-1500648767791-00d5a4ee9baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '3',
      name: 'Ana Gómez',
      date: '2 de Julio, 2024',
      location: 'Madrid, España',
      rating: 5,
      comment: 'La gastronomía es deliciosa y los precios son muy accesibles. ¡Volveré pronto!',
      category: 'pareja',
      image: 'https://images.unsplash.com/photo-1544006659-f0b21884cebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '4',
      name: 'Carlos Pérez',
      date: '20 de Junio, 2024',
      location: 'Buenos Aires, Argentina',
      rating: 4,
      comment: 'Un lugar tranquilo y seguro para disfrutar en familia. Los niños se divirtieron mucho en la playa.',
      category: 'familia',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '5',
      name: 'Emily White',
      date: '5 de Mayo, 2024',
      location: 'London, UK',
      rating: 5,
      comment: 'The wildlife is amazing! We saw whales, dolphins, and lots of birds. A must-see destination for nature lovers.',
      category: 'aventura',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b82bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: '6',
      name: 'Sophie Dubois',
      date: '12 de Abril, 2024',
      location: 'Paris, France',
      rating: 5,
      comment: 'Un endroit magnifique para se détendre et profiter de la nature. Les plages sont propres et l\'eau est claire.',
      category: 'pareja',
      image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    }
  ];

  const categories = [
    { value: 'all', label: t.all },
    { value: 'familia', label: t.family },
    { value: 'pareja', label: t.couple },
    { value: 'aventura', label: t.adventure }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => 
    selectedCategory === 'all' || testimonial.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section */}
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
                {t.backToHome}
              </Button>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-white mr-4 animate-pulse" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  {t.testimonialsTitle}
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                {t.testimonialsSubtitle}
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Users className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">{t.satisfiedVisitors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-ocean-dark">
              {t.testimonialCategories}
            </h2>
            <div className="flex justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant="outline"
                  className={`rounded-full text-lg ${
                    selectedCategory === category.value
                      ? 'bg-ocean text-white hover:bg-ocean-dark'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xl font-bold text-ocean-dark flex items-center">
                    <Quote className="h-5 w-5 mr-2 text-blue-400" />
                    {testimonial.name}
                  </CardTitle>
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-500">{testimonial.rating}</span>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {testimonial.location}
                    <Calendar className="h-4 w-4 mx-1" />
                    {testimonial.date}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {testimonial.comment}
                  </p>
                  {testimonial.image && (
                    <div className="relative overflow-hidden rounded-xl shadow-md">
                      <img
                        src={testimonial.image}
                        alt={`Imagen de ${testimonial.name}`}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTestimonials.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-xl">{t.noTestimonials}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Testimonials;
