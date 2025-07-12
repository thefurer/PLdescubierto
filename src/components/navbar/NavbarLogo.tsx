
import { useVisualConfig } from "@/hooks/useVisualConfig";
import { useNavigate } from "react-router-dom";

interface NavbarLogoProps {
  scrolled: boolean;
}

const NavbarLogo = ({ scrolled }: NavbarLogoProps) => {
  const { config } = useVisualConfig();
  const navigate = useNavigate();

  const getLogoPositionClass = () => {
    switch (config.logoSettings.position) {
      case 'center':
        return 'absolute left-1/2 transform -translate-x-1/2';
      case 'right':
        return 'ml-auto';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center ${getLogoPositionClass()}`}>
      {config.logoSettings.logoUrl ? (
        <img 
          src={config.logoSettings.logoUrl} 
          alt="Puerto López Logo" 
          className="object-contain transition-all cursor-pointer"
          style={{ 
            height: `${config.logoSettings.height}px`,
            filter: scrolled ? 'none' : 'brightness(0) invert(1)'
          }}
          onClick={() => navigate('/')}
        />
      ) : (
        <h1 
          className="font-bold transition-colors cursor-pointer"
          onClick={() => navigate('/')}
          style={{ 
            color: scrolled ? config.navbarSettings.textColor : "white",
            fontSize: `${Math.max(config.logoSettings.height * 0.6, 16)}px`,
            height: `${config.logoSettings.height}px`,
            display: 'flex',
            alignItems: 'center',
            fontFamily: config.typography.fontFamily
          }}
        >
          Puerto López
        </h1>
      )}
    </div>
  );
};

export default NavbarLogo;
