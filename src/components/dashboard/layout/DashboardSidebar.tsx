
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardNavigation from './DashboardNavigation';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
  navigationItems: NavigationItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ navigationItems, activeTab, setActiveTab }: DashboardSidebarProps) => {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Panel de Control</CardTitle>
          <CardDescription className="text-sm">
            Gestiona el contenido de tu sitio web
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 px-6 pb-6">
          <DashboardNavigation
            navigationItems={navigationItems}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSidebar;
