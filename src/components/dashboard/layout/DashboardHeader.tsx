
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardNavigation from './DashboardNavigation';

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigationItems: Array<{
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardHeader = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  navigationItems, 
  activeTab, 
  setActiveTab 
}: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Panel de Control</h2>
                    <DashboardNavigation
                      navigationItems={navigationItems}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      isMobile={true}
                      setSidebarOpen={setSidebarOpen}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-ocean-dark">
              Panel de Administración
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
              Hola, {user?.user_metadata?.full_name || user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs md:text-sm"
            >
              <span className="hidden sm:inline">Ver Sitio</span>
              <span className="sm:hidden">Ver</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-xs md:text-sm"
            >
              <LogOut className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
