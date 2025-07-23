
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import VirtualTour from "@/components/VirtualTour";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import AccessibilityToolbar from "@/components/accessibility/AccessibilityToolbar";
// import ChatBot from "@/components/ChatBot"; // Temporarily disabled

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Attractions />
      <VirtualTour />
      <TestimonialsSection />
      <Footer />
      <AccessibilityToolbar />
      {/* <ChatBot /> */} {/* Temporarily disabled */}
    </div>
  );
};

export default Index;
