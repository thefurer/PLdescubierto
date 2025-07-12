
import { useVisualConfig } from "@/hooks/useVisualConfig";

interface MobileNavigationProps {
  isOpen: boolean;
  navItems: Array<{ label: string; url: string }>;
  onNavigate: (url: string) => void;
  user: any;
}

const MobileNavigation = ({ isOpen, navItems, onNavigate, user }: MobileNavigationProps) => {
  const { config } = useVisualConfig();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      <div 
        className="px-2 pt-2 pb-3 space-y-1 rounded-lg shadow-lg mt-2"
        style={{ backgroundColor: config.navbarSettings.backgroundColor }}
      >
        {navItems.map((item) => (
          <button
            key={item.url}
            onClick={() => onNavigate(item.url)}
            className="block px-3 py-2 rounded-md font-medium w-full text-left transition-colors"
            style={{ 
              color: config.navbarSettings.textColor,
              fontFamily: config.typography.fontFamily
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = config.colorPalette.primary;
              e.currentTarget.style.backgroundColor = `${config.colorPalette.primary}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = config.navbarSettings.textColor;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {item.label}
          </button>
        ))}
        {!user && (
          <button
            onClick={() => onNavigate('/auth')}
            className="block px-3 py-2 rounded-md font-medium w-full text-left transition-colors"
            style={{ 
              color: config.buttonStyles.primaryColor,
              fontFamily: config.typography.fontFamily
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${config.buttonStyles.primaryColor}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
