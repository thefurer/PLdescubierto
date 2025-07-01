
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home } from 'lucide-react';
import DashboardNavigation from './DashboardNavigation';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileTabIndicatorProps {
  navigationItems: NavigationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MobileTabIndicator = ({ 
  navigationItems, 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen 
}: MobileTabIndicatorProps) => {
  const activeItem = navigationItems.find(item => item.id === activeTab);
  const Icon = activeItem?.icon || Home;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2 text-ocean" />
          <span className="font-medium text-sm">{activeItem?.label}</span>
        </div>
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4" />
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
      </div>
    </Card>
  );
};

export default MobileTabIndicator;
