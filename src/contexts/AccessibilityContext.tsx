import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  reducedMotion: boolean;
  focusIndicators: boolean;
  screenReaderOptimized: boolean;
  underlineLinks: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleUnderlineLinks: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  focusIndicators: false,
  screenReaderOptimized: false,
  underlineLinks: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('accessibility-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      console.warn('Error loading accessibility settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      
      // Aplicar configuraciones al documento
      const root = document.documentElement;
      
      // Asegurar que todos los valores estén definidos antes de convertir a string
      if (settings.fontSize) {
        root.setAttribute('data-font-size', settings.fontSize);
      }
      
      if (typeof settings.highContrast === 'boolean') {
        root.setAttribute('data-high-contrast', settings.highContrast.toString());
      }
      
      if (typeof settings.reducedMotion === 'boolean') {
        root.setAttribute('data-reduced-motion', settings.reducedMotion.toString());
      }
      
      if (typeof settings.focusIndicators === 'boolean') {
        root.setAttribute('data-focus-indicators', settings.focusIndicators.toString());
      }
      
      if (typeof settings.screenReaderOptimized === 'boolean') {
        root.setAttribute('data-screen-reader', settings.screenReaderOptimized.toString());
      }
      
      if (typeof settings.underlineLinks === 'boolean') {
        root.setAttribute('data-underline-links', settings.underlineLinks.toString());
      }
    } catch (error) {
      console.warn('Error applying accessibility settings:', error);
    }
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

  const toggleUnderlineLinks = () => {
    updateSettings({ underlineLinks: !settings.underlineLinks });
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
      toggleUnderlineLinks,
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
