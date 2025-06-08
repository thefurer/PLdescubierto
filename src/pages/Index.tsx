import Hero from '@/components/Hero';
import Attractions from '@/components/Attractions';
import Gallery from '@/components/Gallery';
import Activities from '@/components/Activities';
import VirtualTour from '@/components/VirtualTour';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Reviews from '@/components/Reviews';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Attractions />
      <Gallery />
      <Activities />
      <VirtualTour />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
