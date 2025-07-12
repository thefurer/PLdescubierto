
import { useVisualConfig } from "@/hooks/useVisualConfig";

interface DesktopNavigationProps {
  navItems: Array<{ label: string; url: string }>;
  scrolled: boolean;
  onNavigate: (url: string) => void;
}

const DesktopNavigation = ({ navItems, scrolled, onNavigate }: DesktopNavigationProps) => {
  const { config } = useVisualConfig();

  const getNavPositionClass = () => {
    if (config.logoSettings.position === 'center') {
      return 'absolute right-4';
    }
    return '';
  };

  return (
    <div className={`hidden lg:flex items-center space-x-8 ${getNavPositionClass()}`}>
      {navItems.map((item) => (
        <button
          key={item.url}
          onClick={() => onNavigate(item.url)}
          className="font-medium transition-colors"
          style={{ 
            color: scrolled ? config.navbarSettings.textColor : "white",
            fontFamily: config.typography.fontFamily
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = config.colorPalette.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = scrolled ? config.navbarSettings.textColor : "white";
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default DesktopNavigation;
