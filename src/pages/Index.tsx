
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import Activities from "@/components/Activities";
import Gallery from "@/components/Gallery";
import VirtualTour from "@/components/VirtualTour";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Attractions />
      <Activities />
      <Gallery />
      <VirtualTour />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
