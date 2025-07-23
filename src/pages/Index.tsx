
import { useState } from "react";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import VirtualTour from "@/components/VirtualTour";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import InteractiveSidebar from "@/components/InteractiveSidebar";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
// import ChatBot from "@/components/ChatBot"; // Temporarily disabled

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<string>("");

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Floating Map Button */}
      <Button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-ocean hover:bg-ocean-dark text-white shadow-lg rounded-full w-12 h-12 p-0"
        size="sm"
      >
        <Map className="h-5 w-5" />
      </Button>

      {/* Interactive Sidebar */}
      <InteractiveSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        selectedAttraction={selectedAttraction}
      />

      {/* Main Content */}
      <Hero />
      <Attractions onAttractionSelect={setSelectedAttraction} />
      <VirtualTour />
      <TestimonialsSection />
      <Footer />
      {/* <ChatBot /> */} {/* Temporarily disabled */}
    </div>
  );
};

export default Index;
