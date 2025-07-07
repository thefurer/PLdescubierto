
import { VisualConfig } from '@/types/visualConfig';

export const applyConfigToCSS = (config: VisualConfig) => {
  const root = document.documentElement;
  
  // Apply color palette
  Object.entries(config.colorPalette).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Apply typography
  root.style.setProperty('--font-family', config.typography.fontFamily);
  root.style.setProperty('--font-heading-color', config.typography.headingColor);
  root.style.setProperty('--font-body-color', config.typography.bodyColor);
  root.style.setProperty('--font-link-color', config.typography.linkColor);

  // Apply button styles with proper border radius values
  const borderRadiusValue = config.buttonStyles.primaryStyle === 'pill' ? '9999px' : 
                           config.buttonStyles.primaryStyle === 'square' ? '2px' : '8px';
  
  // Apply button styles to CSS variables
  root.style.setProperty('--button-border-radius', borderRadiusValue);
  root.style.setProperty('--button-primary-color', config.buttonStyles.primaryColor);
  root.style.setProperty('--button-secondary-color', config.buttonStyles.secondaryColor);
  root.style.setProperty('--button-hover-effect', config.buttonStyles.hoverEffect);

  // Apply navbar settings
  root.style.setProperty('--navbar-bg-color', config.navbarSettings.backgroundColor);
  root.style.setProperty('--navbar-text-color', config.navbarSettings.textColor);
  root.style.setProperty('--navbar-position', config.navbarSettings.position);

  // Apply button styles to actual buttons
  const buttons = document.querySelectorAll('button, .btn');
  buttons.forEach((button) => {
    const element = button as HTMLElement;
    if (element.classList.contains('btn-primary') || element.getAttribute('data-button-type') === 'primary') {
      element.style.borderRadius = borderRadiusValue;
      element.style.backgroundColor = config.buttonStyles.primaryColor;
    }
    if (element.classList.contains('btn-secondary') || element.getAttribute('data-button-type') === 'secondary') {
      element.style.borderRadius = borderRadiusValue;
      element.style.borderColor = config.buttonStyles.secondaryColor;
      element.style.color = config.buttonStyles.secondaryColor;
    }
  });

  // Dispatch custom event to notify components of config update
  window.dispatchEvent(new CustomEvent('visual-config-updated', { detail: config }));
};
