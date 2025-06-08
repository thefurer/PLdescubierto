
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import ItineraryPlanner from '@/components/itinerary/ItineraryPlanner';

const ItineraryPlannerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 pb-8">
        <ItineraryPlanner />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ItineraryPlannerPage;
