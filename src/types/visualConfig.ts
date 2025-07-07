
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
    primary: '#2563eb',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b',
    navbar: '#ffffff',
    button: '#2563eb',
    link: '#2563eb',
    card: '#f8fafc',
    border: '#e5e7eb',
    muted: '#6b7280',
    destructive: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
  navbarSettings: {
    items: [
      { name: 'Inicio', url: '#hero', visible: true, order: 1 },
      { name: 'Atracciones', url: '#attractions', visible: true, order: 2 },
      { name: 'Actividades', url: '#activities', visible: true, order: 3 },
      { name: 'Galería', url: '#gallery', visible: true, order: 4 },
      { name: 'Contacto', url: '#contact', visible: true, order: 5 },
    ],
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
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
    primaryColor: '#2563eb',
    secondaryColor: '#10b981',
    hoverEffect: 'scale',
  },
  typography: {
    fontFamily: 'Poppins',
    headingColor: '#1f2937',
    bodyColor: '#4b5563',
    linkColor: '#2563eb',
  },
};
