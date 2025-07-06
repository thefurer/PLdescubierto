
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

const defaultConfig: VisualConfig = {
  colorPalette: {
    primary: '#2563eb',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b',
    navbar: '#ffffff',
    button: '#2563eb',
    link: '#2563eb',
  },
  navbarSettings: {
    items: [
      { name: 'Inicio', url: '/', visible: true, order: 1 },
      { name: 'Atracciones', url: '/attractions', visible: true, order: 2 },
      { name: 'Galería', url: '/gallery', visible: true, order: 3 },
      { name: 'Contacto', url: '/contact', visible: true, order: 4 },
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

export const useVisualConfig = () => {
  const [config, setConfig] = useState<VisualConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Create content history entry
  const createHistoryEntry = async (sectionName: string, oldContent: any, newContent: any, changeType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('content_history')
        .insert({
          section_name: sectionName,
          old_content: oldContent,
          new_content: newContent,
          change_type: changeType,
          changed_by: user.id
        });
    } catch (error) {
      console.error('Error creating history entry:', error);
    }
  };

  // Load configuration from database
  const loadConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_visual_config')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const mergedConfig = { ...defaultConfig };
      
      data?.forEach(configItem => {
        const configData = configItem.config_data as any;
        if (configItem.config_type === 'color_palette') {
          mergedConfig.colorPalette = { ...mergedConfig.colorPalette, ...configData };
        } else if (configItem.config_type === 'navbar_settings') {
          mergedConfig.navbarSettings = { ...mergedConfig.navbarSettings, ...configData };
        } else if (configItem.config_type === 'logo_settings') {
          mergedConfig.logoSettings = { ...mergedConfig.logoSettings, ...configData };
        } else if (configItem.config_type === 'button_styles') {
          mergedConfig.buttonStyles = { ...mergedConfig.buttonStyles, ...configData };
        } else if (configItem.config_type === 'typography') {
          mergedConfig.typography = { ...mergedConfig.typography, ...configData };
        }
      });

      setConfig(mergedConfig);
      applyConfigToCSS(mergedConfig);
      
      // Store in localStorage for persistence across sessions
      localStorage.setItem('visual_config', JSON.stringify(mergedConfig));
    } catch (error) {
      console.error('Error loading visual config:', error);
      
      // Try to load from localStorage as fallback
      const savedConfig = localStorage.getItem('visual_config');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
          applyConfigToCSS(parsedConfig);
        } catch (e) {
          console.error('Error parsing saved config:', e);
        }
      }
      
      toast.error('Error al cargar la configuración visual');
    } finally {
      setLoading(false);
    }
  };

  // Apply configuration to CSS custom properties
  const applyConfigToCSS = (visualConfig: VisualConfig) => {
    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHsl = (hex: string) => {
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

  // Save configuration to database
  const saveConfig = async (newConfig: Partial<VisualConfig>) => {
    try {
      setLoading(true);
      const oldConfig = { ...config };
      const updatedConfig = { ...config, ...newConfig };
      
      // Save each config type separately
      const configTypeMap = {
        colorPalette: 'color_palette',
        navbarSettings: 'navbar_settings', 
        logoSettings: 'logo_settings',
        buttonStyles: 'button_styles',
        typography: 'typography'
      };

      for (const [key, configType] of Object.entries(configTypeMap)) {
        if (newConfig[key as keyof VisualConfig]) {
          const { error } = await supabase
            .from('site_visual_config')
            .upsert({
              config_type: configType,
              config_data: updatedConfig[key as keyof VisualConfig],
              is_active: true,
            }, {
              onConflict: 'config_type,is_active'
            });

          if (error) throw error;

          // Create history entry for each changed section
          await createHistoryEntry(
            `visual_config_${configType}`,
            oldConfig[key as keyof VisualConfig],
            updatedConfig[key as keyof VisualConfig],
            'update'
          );
        }
      }

      setConfig(updatedConfig);
      applyConfigToCSS(updatedConfig);
      setPreviewMode(false);
      
      // Update localStorage
      localStorage.setItem('visual_config', JSON.stringify(updatedConfig));
      
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving visual config:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  // Preview configuration without saving
  const previewConfig = (previewConfig: Partial<VisualConfig>) => {
    const tempConfig = { ...config, ...previewConfig };
    applyConfigToCSS(tempConfig);
    setPreviewMode(true);
  };

  // Reset preview
  const resetPreview = () => {
    applyConfigToCSS(config);
    setPreviewMode(false);
  };

  // Real-time updates
  useEffect(() => {
    loadConfig();

    const channel = supabase
      .channel('visual-config-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_visual_config'
        },
        () => {
          loadConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Apply saved config on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('visual_config');
    if (savedConfig && !loading) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        applyConfigToCSS(parsedConfig);
      } catch (e) {
        console.error('Error applying saved config:', e);
      }
    }
  }, [loading]);

  return {
    config,
    loading,
    previewMode,
    saveConfig,
    previewConfig,
    resetPreview,
    loadConfig,
  };
};
