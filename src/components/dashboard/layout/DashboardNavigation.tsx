
import { Button } from '@/components/ui/button';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardNavigationProps {
  navigationItems: NavigationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

const DashboardNavigation = ({ 
  navigationItems, 
  activeTab, 
  setActiveTab, 
  isMobile = false, 
  setSidebarOpen 
}: DashboardNavigationProps) => {
  const handleTabClick = (itemId: string) => {
    setActiveTab(itemId);
    if (isMobile && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className="w-full justify-start text-left"
            onClick={() => handleTabClick(item.id)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};

export default DashboardNavigation;
