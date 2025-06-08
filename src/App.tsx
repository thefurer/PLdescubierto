
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import FocusManager from "@/components/accessibility/FocusManager";
import SkipToContent from "@/components/accessibility/SkipToContent";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import TravelGuide from "./pages/TravelGuide";
import FAQ from "./pages/FAQ";
import Testimonials from "./pages/Testimonials";
import Blog from "./pages/Blog";
import ItineraryPlanner from "./pages/ItineraryPlanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AccessibilityProvider>
      <AuthProvider>
        <TooltipProvider>
          <FocusManager>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen w-full">
                <SkipToContent />
                <main id="main-content" tabIndex={-1}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/travel-guide" element={<TravelGuide />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/itinerary-planner" element={<ItineraryPlanner />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </FocusManager>
        </TooltipProvider>
      </AuthProvider>
    </AccessibilityProvider>
  </QueryClientProvider>
);

export default App;
