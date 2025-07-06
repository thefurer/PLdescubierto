
import { VisualConfig } from '@/types/visualConfig';

// Convert hex to HSL for CSS custom properties
export const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h! /= 6;
  }
  
  return `${Math.round(h! * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// Apply configuration to CSS custom properties
export const applyConfigToCSS = (visualConfig: VisualConfig) => {
  const root = document.documentElement;
  
  // Apply color palette
  root.style.setProperty('--primary', hexToHsl(visualConfig.colorPalette.primary));
  root.style.setProperty('--secondary', hexToHsl(visualConfig.colorPalette.secondary));
  root.style.setProperty('--background', hexToHsl(visualConfig.colorPalette.background));
  root.style.setProperty('--foreground', hexToHsl(visualConfig.colorPalette.text));
  root.style.setProperty('--accent', hexToHsl(visualConfig.colorPalette.accent));
  
  // Apply Puerto López theme colors
  root.style.setProperty('--ocean-blue', hexToHsl(visualConfig.colorPalette.primary));
  root.style.setProperty('--green-primary', hexToHsl(visualConfig.colorPalette.secondary));
  root.style.setProperty('--coral', hexToHsl(visualConfig.colorPalette.accent));
  
  // Apply navbar colors
  root.style.setProperty('--navbar-bg', hexToHsl(visualConfig.navbarSettings.backgroundColor));
  root.style.setProperty('--navbar-text', hexToHsl(visualConfig.navbarSettings.textColor));
  
  // Apply button colors
  root.style.setProperty('--button-primary', hexToHsl(visualConfig.buttonStyles.primaryColor));
  root.style.setProperty('--button-secondary', hexToHsl(visualConfig.buttonStyles.secondaryColor));
  
  // Apply typography colors
  root.style.setProperty('--heading-color', hexToHsl(visualConfig.typography.headingColor));
  root.style.setProperty('--body-color', hexToHsl(visualConfig.typography.bodyColor));
  root.style.setProperty('--link-color', hexToHsl(visualConfig.typography.linkColor));

  // Force a re-render by triggering a storage event
  window.dispatchEvent(new Event('visual-config-updated'));
};
