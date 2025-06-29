
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentManager } from "@/hooks/useContentManager";

const Hero = () => {
  const { content } = useContentManager();
  
  // Extract hero content from the content array
  const heroContent = content.find(item => item.section_name === 'hero')?.content;

  const scrollToAttractions = () => {
    const attractionsSection = document.getElementById('attractions');
    if (attractionsSection) {
      attractionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-ocean via-ocean-dark to-ocean-darker">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center bg-no-repeat"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in-up">
          {heroContent?.title || 'Puerto López'}
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-3xl font-light mb-2 animate-fade-in-up animation-delay-200">
          {heroContent?.subtitle || 'Descubre sus Atracciones'}
        </p>
        
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-fade-in-up animation-delay-400">
          {heroContent?.description || 'Bellezas Naturales y Culturales'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <Button
            onClick={scrollToAttractions}
            size="lg"
            className="bg-white text-ocean hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            Explorar Atracciones
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-white opacity-70" />
      </div>
    </section>
  );
};

export default Hero;
