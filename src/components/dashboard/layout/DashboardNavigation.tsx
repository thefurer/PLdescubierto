import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const iconColors: Record<string, string> = {
  'hero': 'text-blue-500',
  'footer': 'text-slate-500',
  'attractions': 'text-emerald-500',
  'travel-guide': 'text-amber-500',
  'visual-design': 'text-purple-500',
  'admin': 'text-rose-500',
  'history': 'text-cyan-500',
  'profile': 'text-indigo-500',
};

const activeIconColors: Record<string, string> = {
  'hero': 'text-blue-600',
  'footer': 'text-slate-600',
  'attractions': 'text-emerald-600',
  'travel-guide': 'text-amber-600',
  'visual-design': 'text-purple-600',
  'admin': 'text-rose-600',
  'history': 'text-cyan-600',
  'profile': 'text-indigo-600',
};

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
    <nav className="space-y-1.5">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start text-left group relative overflow-hidden transition-all duration-300",
              isActive 
                ? "bg-gradient-to-r from-primary/15 to-accent/10 text-foreground font-medium shadow-sm border border-primary/20" 
                : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabClick(item.id)}
          >
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
            )}
            <Icon 
              className={cn(
                "h-4 w-4 mr-3 transition-all duration-300",
                isActive 
                  ? activeIconColors[item.id] || 'text-primary' 
                  : iconColors[item.id] || 'text-muted-foreground',
                "group-hover:scale-110"
              )} 
            />
            <span className="truncate">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};

export default DashboardNavigation;
