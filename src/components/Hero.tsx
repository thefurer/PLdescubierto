
import { ArrowDown, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "./Navbar";
import { useContentManager } from "@/hooks/useContentManager";

const Hero = () => {
  const { content, loading } = useContentManager('hero');

  if (loading) {
    return (
      <section className="relative min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-ocean/20 to-green-secondary/20">
          <div className="animate-pulse text-ocean">Cargando...</div>
        </div>
      </section>
    );
  }

  const heroData = content || {
    title: "Descubre Puerto López",
    subtitle: "El paraíso ecuatoriano te espera",
    description: "Explora las maravillas naturales de Puerto López, desde el avistamiento de ballenas hasta playas paradisíacas y aventuras únicas en el corazón de Manabí.",
    primaryButton: "Explorar Destinos",
    secondaryButton: "Ver Galería",
    backgroundImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    highlights: [
      "Avistamiento de ballenas jorobadas",
      "Parque Nacional Machalilla", 
      "Isla de la Plata",
      "Playa Los Frailes"
    ]
  };

  const scrollToAttractions = () => {
    const attractionsSection = document.getElementById('attractions');
    if (attractionsSection) {
      attractionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url("${heroData.backgroundImage}")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            Puerto López, Ecuador
          </Badge>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-shadow-lg">{heroData.title}</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal mt-2 text-green-secondary">
              {heroData.subtitle}
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 leading-relaxed max-w-3xl mx-auto text-gray-100">
            {heroData.description}
          </p>
          
          {/* Highlights */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
            {heroData.highlights?.map((highlight: string, index: number) => (
              <div key={index} className="glass-card p-3 lg:p-4 text-center">
                <p className="text-sm lg:text-base font-medium text-white">{highlight}</p>
              </div>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={scrollToAttractions}
              className="bg-green-primary hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <MapPin className="mr-2 h-5 w-5" />
              {heroData.primaryButton}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToContact}
              className="border-2 border-white text-white hover:bg-white hover:text-ocean px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm bg-white/10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contactar
            </Button>
          </div>
          
          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToAttractions}
              className="text-white hover:text-green-secondary transition-colors"
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
