
import { VisualConfig } from '@/types/visualConfig';

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): string => {
  // Handle null/undefined/empty values
  if (!hex) return '0 0% 0%';
  
  // Remove # if present and handle short hex values
  hex = hex.replace('#', '');
  
  // Handle 3-character hex codes by expanding them
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Ensure we have a valid 6-character hex
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn(`Invalid hex color: ${hex}, using fallback`);
    return '0 0% 0%'; // Fallback to black
  }
  
  // Parse r, g, b values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export const applyConfigToCSS = (config: VisualConfig) => {
  const root = document.documentElement;
  
  // Apply color palette with HSL conversion
  Object.entries(config.colorPalette).forEach(([key, value]) => {
    // Ensure value is valid and convert to HSL if it's a hex color
    let hslValue = value;
    if (value && value.startsWith('#')) {
      hslValue = hexToHsl(value);
    } else if (value && !value.includes(' ')) {
      // If it's not HSL format (missing spaces), assume it's a hex without #
      hslValue = hexToHsl('#' + value.replace('#', ''));
    }
    
    // Set dynamic color variables
    root.style.setProperty(`--color-${key}`, hslValue);
    
    // Also update main CSS variables for theme compatibility
    if (key === 'primary') {
      root.style.setProperty('--primary', hslValue);
    } else if (key === 'secondary') {
      root.style.setProperty('--secondary', hslValue);
    } else if (key === 'background') {
      root.style.setProperty('--background', hslValue);
    } else if (key === 'text') {
      root.style.setProperty('--foreground', hslValue);
    } else if (key === 'accent') {
      root.style.setProperty('--accent', hslValue);
    } else if (key === 'card') {
      root.style.setProperty('--card', hslValue);
    } else if (key === 'border') {
      root.style.setProperty('--border', hslValue);
    } else if (key === 'muted') {
      root.style.setProperty('--muted', hslValue);
    } else if (key === 'destructive') {
      root.style.setProperty('--destructive', hslValue);
    } else if (key === 'warning') {
      root.style.setProperty('--warning', hslValue);
    } else if (key === 'success') {
      root.style.setProperty('--success', hslValue);
    } else if (key === 'info') {
      root.style.setProperty('--info', hslValue);
    }
  });

  // Apply typography with HSL conversion for colors
  root.style.setProperty('--font-family', config.typography.fontFamily);
  
  const headingColorHsl = config.typography.headingColor.startsWith('#') 
    ? hexToHsl(config.typography.headingColor) 
    : config.typography.headingColor;
  const bodyColorHsl = config.typography.bodyColor.startsWith('#') 
    ? hexToHsl(config.typography.bodyColor) 
    : config.typography.bodyColor;
  const linkColorHsl = config.typography.linkColor.startsWith('#') 
    ? hexToHsl(config.typography.linkColor) 
    : config.typography.linkColor;
    
  root.style.setProperty('--font-heading-color', headingColorHsl);
  root.style.setProperty('--font-body-color', bodyColorHsl);
  root.style.setProperty('--font-link-color', linkColorHsl);

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

  // Apply logo settings globally
  const logoElements = document.querySelectorAll('[data-logo]');
  logoElements.forEach((element) => {
    const logoEl = element as HTMLElement;
    logoEl.style.height = `${config.logoSettings.height}px`;
  });

  // Dispatch custom event to notify components of config update
  window.dispatchEvent(new CustomEvent('visual-config-updated', { detail: config }));
};
