
import { useVisualConfig } from "@/hooks/useVisualConfig";

export const useNavbarButtonStyles = () => {
  const { config } = useVisualConfig();

  const getButtonStyle = (isPrimary = true, scrolled = false) => {
    let borderRadius = '8px'; // default rounded
    
    if (config.buttonStyles.primaryStyle === 'pill') {
      borderRadius = '9999px';
    } else if (config.buttonStyles.primaryStyle === 'square') {
      borderRadius = '4px';
    }

    const baseStyle = {
      borderRadius,
      transition: 'all 0.2s ease-in-out',
      fontFamily: config.typography.fontFamily,
    };

    if (isPrimary) {
      return {
        ...baseStyle,
        backgroundColor: scrolled ? config.buttonStyles.primaryColor : "white",
        color: scrolled ? "white" : config.buttonStyles.primaryColor,
        border: 'none',
      };
    } else {
      return {
        ...baseStyle,
        borderColor: scrolled ? config.buttonStyles.secondaryColor : "white",
        color: scrolled ? config.buttonStyles.secondaryColor : "white",
        backgroundColor: 'transparent',
        border: `2px solid ${scrolled ? config.buttonStyles.secondaryColor : "white"}`,
      };
    }
  };

  const applyHoverEffect = (element: HTMLElement, isEntering: boolean, isPrimary = true) => {
    if (!isEntering) {
      element.style.transform = 'scale(1)';
      element.style.boxShadow = 'none';
      if (isPrimary) {
        element.style.backgroundColor = element.dataset.scrolled === 'true' ? config.buttonStyles.primaryColor : "white";
      } else {
        element.style.backgroundColor = 'transparent';
      }
      return;
    }

    const hoverColor = isPrimary ? config.buttonStyles.secondaryColor : config.buttonStyles.primaryColor;
    
    if (isPrimary) {
      element.style.backgroundColor = hoverColor;
      element.style.color = "white";
    } else {
      element.style.backgroundColor = hoverColor;
      element.style.color = "white";
    }

    switch (config.buttonStyles.hoverEffect) {
      case 'scale':
        element.style.transform = 'scale(1.05)';
        break;
      case 'shadow':
        element.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        break;
      case 'glow':
        element.style.boxShadow = `0 0 20px ${hoverColor}40`;
        break;
    }
  };

  return { getButtonStyle, applyHoverEffect };
};
