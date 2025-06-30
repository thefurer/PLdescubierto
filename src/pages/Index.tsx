
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import VirtualTour from "@/components/VirtualTour";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="section-light">
        <Hero />
      </section>
      
      {/* Attractions Section */}
      <section className="section-dark">
        <Attractions />
      </section>
      
      {/* Virtual Tour Section */}
      <section className="section-light">
        <VirtualTour />
      </section>
      
      {/* Testimonials Section */}
      <section className="section-dark">
        <TestimonialsSection />
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Index;
