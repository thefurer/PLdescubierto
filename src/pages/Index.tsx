
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import VirtualTour from "@/components/VirtualTour";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Attractions />
      <VirtualTour />
      <Footer />
      <AccessibilityToolbar />
      <ChatBot />
    </div>
  );
};

export default Index;
