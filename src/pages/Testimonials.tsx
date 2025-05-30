
import { useState } from 'react';
import { ArrowLeft, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Testimonials = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "María Elena Vargas",
      location: "Guayaquil, Ecuador",
      rating: 5,
      comment: "¡Puerto López es un paraíso! El tour de ballenas fue increíble, pudimos ver como 6 ballenas jorobadas con sus crías. Los guías son muy profesionales y conocen mucho sobre la fauna marina. La Isla de la Plata es espectacular, el snorkeling fue una experiencia única.",
      experience: "Tour de Ballenas + Isla de la Plata",
      date: "Agosto 2024"
    },
    {
      name: "Carlos Andrade Mendoza",
      location: "Quito, Ecuador",
      rating: 5,
      comment: "Excelente destino para vacaciones familiares. Mis hijos quedaron fascinados con las ballenas. Los Frailes es la playa más hermosa que he visto en Ecuador. El agua cristalina y la arena blanca son perfectas. Definitivamente regresaremos el próximo año.",
      experience: "Vacaciones familiares - 4 días",
      date: "Julio 2024"
    },
    {
      name: "Ana Lucía Jiménez",
      location: "Cuenca, Ecuador",
      rating: 4,
      comment: "Me encantó la tranquilidad del pueblo y la calidez de su gente. La comida del mar es deliciosa, especialmente el ceviche. El Parque Nacional Machalilla tiene senderos hermosos. Solo sugiero mejorar un poco la señalización en los senderos.",
      experience: "Ecoturismo y gastronomía",
      date: "Septiembre 2024"
    },
    {
      name: "Roberto Silva Castillo",
      location: "Manta, Ecuador",
      rating: 5,
      comment: "Como manabita, he visitado muchas playas, pero Puerto López tiene algo especial. La combinación de cultura, naturaleza y aventura es perfecta. Los pescadores locales son muy amables y siempre dispuestos a compartir sus historias.",
      experience: "Turismo local",
      date: "Junio 2024"
    },
    {
      name: "Sofía Morales Vera",
      location: "Ambato, Ecuador",
      rating: 5,
      comment: "¡Experiencia inolvidable! Ver ballenas en su hábitat natural fue emocionante. Agua Blanca es un sitio arqueológico fascinante, aprendimos mucho sobre la cultura precolombina. Las aguas termales fueron relajantes después de tanto caminar.",
      experience: "Tour cultural y ballenas",
      date: "Agosto 2024"
    },
    {
      name: "Diego Hernández López",
      location: "Loja, Ecuador",
      rating: 4,
      comment: "Puerto López superó mis expectativas. La biodiversidad es impresionante, tanto marina como terrestre. Los guides locales conocen cada rincón y tienen historias fascinantes. La playa del pueblo es perfecta para relajarse al atardecer.",
      experience: "Aventura y naturaleza",
      date: "Julio 2024"
    },
    {
      name: "Gabriela Pérez Intriago",
      location: "Portoviejo, Ecuador",
      rating: 5,
      comment: "Como bióloga marina, Puerto López me impresionó por su conservación. Ver ballenas jorobadas tan cerca es un privilegio. La Isla de la Plata merece el nombre de 'Galápagos del continente'. Excelente trabajo de conservación por parte de las autoridades.",
      experience: "Investigación y turismo científico",
      date: "Septiembre 2024"
    },
    {
      name: "Fernando Alvarado Ruiz",
      location: "Machala, Ecuador",
      rating: 4,
      comment: "Perfecto para desconectarse de la ciudad. La pesca deportiva es excelente, capturamos dorados y atunes. Los restaurantes sirven el pescado más fresco. Solo necesitan mejorar un poco la infraestructura hotelera, pero el encanto natural lo compensa todo.",
      experience: "Pesca deportiva",
      date: "Agosto 2024"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;

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
              <h1 className="text-4xl font-bold text-ocean-dark">Testimonios</h1>
              <p className="text-gray-600 mt-2">Lo que dicen nuestros visitantes sobre Puerto López</p>
            </div>
          </div>

          {/* Rating Summary */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex justify-center items-center space-x-2 mb-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-2xl font-bold text-ocean-dark">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-gray-600">
                  Basado en {testimonials.length} reseñas de visitantes ecuatorianos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-ocean-dark">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        {testimonial.location}
                      </CardDescription>
                    </div>
                    <Quote className="h-6 w-6 text-green-500 opacity-50" />
                  </div>
                  <div className="flex items-center justify-between">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <strong className="text-ocean-dark">Experiencia:</strong> {testimonial.experience}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="mt-8 bg-green-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-ocean-dark mb-2">
                ¿Ya visitaste Puerto López?
              </h3>
              <p className="text-gray-600 mb-4">
                Comparte tu experiencia y ayuda a otros viajeros a descubrir este paraíso
              </p>
              <Button 
                onClick={() => window.open('https://wa.me/593991995390?text=Hola, me gustaría compartir mi experiencia en Puerto López', '_blank')}
                className="bg-green-500 hover:bg-green-600"
              >
                Compartir mi experiencia
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Testimonials;
