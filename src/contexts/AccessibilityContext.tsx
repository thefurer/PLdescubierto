
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  focusIndicators: true,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Aplicar configuraciones al documento
    const root = document.documentElement;
    
    // Tamaño de fuente
    root.setAttribute('data-font-size', settings.fontSize);
    
    // Alto contraste
    root.setAttribute('data-high-contrast', settings.highContrast.toString());
    
    // Movimiento reducido
    root.setAttribute('data-reduced-motion', settings.reducedMotion.toString());
    
    // Indicadores de foco
    root.setAttribute('data-focus-indicators', settings.focusIndicators.toString());
    
    // Optimización para lectores de pantalla
    root.setAttribute('data-screen-reader', settings.screenReaderOptimized.toString());
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
  };

  const increaseFontSize = () => {
    const sizes: AccessibilitySettings['fontSize'][] = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex < sizes.length - 1) {
      updateSettings({ fontSize: sizes[currentIndex + 1] });
    }
  };

  const decreaseFontSize = () => {
    const sizes: AccessibilitySettings['fontSize'][] = ['small', 'medium', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      updateSettings({ fontSize: sizes[currentIndex - 1] });
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSettings,
      toggleHighContrast,
      increaseFontSize,
      decreaseFontSize,
      resetSettings,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
