
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import VirtualTour from "@/components/VirtualTour";
import TestimonialsSection from "@/components/TestimonialsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Attractions />
      <VirtualTour />
      <TestimonialsSection />
      <Contact />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
