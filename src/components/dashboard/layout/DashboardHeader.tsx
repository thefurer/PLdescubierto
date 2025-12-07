import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LogOut, Menu, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardNavigation from './DashboardNavigation';
import ResourcesDropdown from '../resources/ResourcesDropdown';

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
    <header className="bg-gradient-to-r from-primary/95 via-accent/90 to-primary/95 shadow-lg border-b border-primary/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mr-1 text-primary-foreground hover:bg-primary-foreground/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-gradient-to-b from-card to-muted/30">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">Panel de Control</h2>
                    </div>
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
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur-sm items-center justify-center border border-primary-foreground/30">
                <img 
                  src="/images/logos/smart-city-core.png" 
                  alt="Smart City Core" 
                  className="h-7 w-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-primary-foreground">
                  Panel de Administración
                </h1>
                <p className="text-xs text-primary-foreground/70 hidden sm:block">
                  Puerto López Descubierto
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs md:text-sm text-primary-foreground/90 hidden lg:block bg-primary-foreground/10 px-3 py-1.5 rounded-full">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </span>
            
            <ResourcesDropdown />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-1.5"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Sitio</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground hover:bg-primary-foreground/10 gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
