
import { Menu, X } from "lucide-react";
import { useVisualConfig } from "@/hooks/useVisualConfig";

interface MobileMenuButtonProps {
  isOpen: boolean;
  scrolled: boolean;
  onClick: () => void;
}

const MobileMenuButton = ({ isOpen, scrolled, onClick }: MobileMenuButtonProps) => {
  const { config } = useVisualConfig();

  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-md transition-colors"
      style={{
        color: scrolled ? config.navbarSettings.textColor : "white"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = scrolled ? `${config.navbarSettings.textColor}10` : "rgba(255,255,255,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default MobileMenuButton;
