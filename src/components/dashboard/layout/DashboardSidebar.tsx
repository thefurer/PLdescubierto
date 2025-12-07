import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
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
      <Card className="sticky top-24 overflow-hidden border-0 shadow-xl bg-gradient-to-b from-card via-card to-muted/30 backdrop-blur-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base md:text-lg text-foreground">Panel de Control</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Gestiona tu sitio web
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
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
