
import { useState } from 'react';
import { 
  FileText, 
  History, 
  User,
  MapPin,
  Home,
  Shield,
  Palette
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardHeader from '@/components/dashboard/layout/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/layout/DashboardSidebar';
import DashboardContent from '@/components/dashboard/layout/DashboardContent';
import MobileTabIndicator from '@/components/dashboard/layout/MobileTabIndicator';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'hero', label: 'Editar Portada', icon: Home },
    { id: 'footer', label: 'Editar Pie de Página', icon: FileText },
    { id: 'attractions', label: 'Editar Atracciones', icon: MapPin },
    { id: 'visual-design', label: 'Diseño Visual y Ajustes', icon: Palette },
    { id: 'admin', label: 'Gestión de Admins', icon: Shield },
    { id: 'history', label: 'Historial de Cambios', icon: History },
    { id: 'profile', label: 'Mi Perfil', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigationItems={navigationItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {!isMobile && (
            <DashboardSidebar
              navigationItems={navigationItems}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          <div className="lg:col-span-3">
            <div className="space-y-4 md:space-y-6">
              {isMobile && (
                <MobileTabIndicator
                  navigationItems={navigationItems}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              )}
              
              <DashboardContent activeTab={activeTab} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
