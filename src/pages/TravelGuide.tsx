
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import TravelGuideHero from '@/components/travel-guide/TravelGuideHero';
import InteractiveMap from '@/components/travel-guide/InteractiveMap';
import TravelGuidePoints from '@/components/travel-guide/TravelGuidePoints';
import TransportOptions from '@/components/travel-guide/TransportOptions';
import TravelTips from '@/components/travel-guide/TravelTips';

const TravelGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <TravelGuideHero />

      <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <TravelGuidePoints />
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
