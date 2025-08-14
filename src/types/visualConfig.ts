
export interface VisualConfig {
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    navbar: string;
    button: string;
    link: string;
    card: string;
    border: string;
    muted: string;
    destructive: string;
    warning: string;
    success: string;
    info: string;
  };
  navbarSettings: {
    items: Array<{
      name: string;
      url: string;
      visible: boolean;
      order: number;
    }>;
    backgroundColor: string;
    textColor: string;
    position: 'fixed' | 'static';
  };
  logoSettings: {
    position: 'left' | 'center' | 'right';
    size: 'small' | 'standard' | 'large';
    height: number;
    margin: string;
    logoUrl?: string;
  };
  buttonStyles: {
    primaryStyle: 'rounded' | 'square' | 'pill';
    primaryColor: string;
    secondaryColor: string;
    hoverEffect: 'scale' | 'shadow' | 'glow';
  };
  typography: {
    fontFamily: string;
    headingColor: string;
    bodyColor: string;
    linkColor: string;
  };
}

export const defaultConfig: VisualConfig = {
  colorPalette: {
    primary: '200 82% 39%',        // Ocean blue HSL
    secondary: '142 70% 38%',      // Green HSL
    background: '210 100% 99%',    // Almost white HSL
    text: '222 84% 5%',           // Dark text HSL
    accent: '199 75% 48%',        // Accent blue HSL
    navbar: '0 0% 100%',          // White HSL
    button: '200 82% 39%',        // Primary color HSL
    link: '200 82% 39%',          // Primary color HSL
    card: '0 0% 100%',            // White HSL
    border: '214 32% 91%',        // Light border HSL
    muted: '215 16% 47%',         // Muted text HSL
    destructive: '0 84% 60%',     // Red HSL
    warning: '43 96% 56%',        // Orange HSL
    success: '142 70% 38%',       // Green HSL
    info: '217 91% 60%',          // Blue HSL
  },
  navbarSettings: {
    items: [
      { name: 'Inicio', url: '#hero', visible: true, order: 1 },
      { name: 'Atracciones', url: '#attractions', visible: true, order: 2 },
      { name: 'Actividades', url: '#activities', visible: true, order: 3 },
      { name: 'Galería', url: '#gallery', visible: true, order: 4 },
      { name: 'Contacto', url: '#contact', visible: true, order: 5 },
    ],
    backgroundColor: '0 0% 100%',     // White HSL
    textColor: '222 84% 5%',         // Dark text HSL
    position: 'fixed',
  },
  logoSettings: {
    position: 'left',
    size: 'standard',
    height: 40,
    margin: 'auto',
  },
  buttonStyles: {
    primaryStyle: 'rounded',
    primaryColor: '200 82% 39%',     // Ocean blue HSL
    secondaryColor: '142 70% 38%',   // Green HSL
    hoverEffect: 'scale',
  },
  typography: {
    fontFamily: 'Poppins',
    headingColor: '222 84% 5%',      // Dark text HSL
    bodyColor: '215 16% 47%',        // Muted text HSL
    linkColor: '200 82% 39%',        // Ocean blue HSL
  },
};
