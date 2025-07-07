
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
                           config.buttonStyles.primaryStyle === 'square' ? '4px' : '8px';
  
  root.style.setProperty('--button-primary-style', borderRadiusValue);
  root.style.setProperty('--button-primary-color', config.buttonStyles.primaryColor);
  root.style.setProperty('--button-secondary-color', config.buttonStyles.secondaryColor);
  root.style.setProperty('--button-hover-effect', config.buttonStyles.hoverEffect);

  // Apply navbar settings
  root.style.setProperty('--navbar-bg-color', config.navbarSettings.backgroundColor);
  root.style.setProperty('--navbar-text-color', config.navbarSettings.textColor);
  root.style.setProperty('--navbar-position', config.navbarSettings.position);

  // Dispatch custom event to notify components of config update
  window.dispatchEvent(new CustomEvent('visual-config-updated', { detail: config }));
};
