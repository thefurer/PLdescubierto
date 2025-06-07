
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import TravelGuideHero from '@/components/travel-guide/TravelGuideHero';
import InteractiveMap from '@/components/travel-guide/InteractiveMap';
import TransportOptions from '@/components/travel-guide/TransportOptions';
import TravelTips from '@/components/travel-guide/TravelTips';

const TravelGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <TravelGuideHero />

      <div className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <InteractiveMap />
          <TransportOptions />
          <TravelTips />
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default TravelGuide;
