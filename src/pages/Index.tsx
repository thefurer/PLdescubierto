
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
      <section className="section-dark py-20">
        <div className="section-container">
          <Attractions />
        </div>
      </section>
      
      {/* Virtual Tour Section */}
      <section className="section-light py-20">
        <div className="section-container">
          <VirtualTour />
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section-dark py-20">
        <div className="section-container">
          <TestimonialsSection />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
      
      {/* ChatBot - mantener funcionalidad existente */}
      <ChatBot />
    </div>
  );
};

export default Index;
