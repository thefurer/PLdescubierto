
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'María González',
      location: 'Quito, Ecuador',
      rating: 5,
      comment: 'Puerto López es un paraíso escondido. El avistamiento de ballenas fue una experiencia única e inolvidable. ¡Definitivamente regresaré!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b82bb3?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      location: 'Guayaquil, Ecuador',
      rating: 5,
      comment: 'La Isla de la Plata es espectacular. La diversidad de aves y la belleza natural del lugar superaron todas mis expectativas.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Ana Rodríguez',
      location: 'Cuenca, Ecuador',
      rating: 5,
      comment: 'El tour gastronómico fue increíble. Probamos ceviches frescos y mariscos deliciosos. La hospitalidad de la gente es excepcional.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-ocean-dark mb-4">
            Lo que dicen nuestros visitantes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre las experiencias reales de quienes han visitado Puerto López
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-ocean/30 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={`Foto de ${testimonial.name}`}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-ocean-dark">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
