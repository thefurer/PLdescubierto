
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { VisualConfig, defaultConfig } from '@/types/visualConfig';
import { applyConfigToCSS } from '@/utils/cssUtils';
import { loadConfigFromDatabase, saveConfigToDatabase, subscribeToConfigChanges } from '@/services/visualConfigService';

export const useVisualConfig = () => {
  const [config, setConfig] = useState<VisualConfig>(() => {
    // Try to load from localStorage first
    const savedConfig = localStorage.getItem('visual_config');
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error('Error parsing saved config:', e);
      }
    }
    return defaultConfig;
  });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Load configuration from database
  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await loadConfigFromDatabase();

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
      // Don't show error toast for users who are not logged in
      // This allows the app to work with default config for public visitors
      if (error?.message && !error.message.includes('unauthorized')) {
        toast.error('Error al cargar la configuración visual');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save configuration to database
  const saveConfig = async (newConfig: Partial<VisualConfig>) => {
    try {
      setLoading(true);
      const oldConfig = { ...config };
      const updatedConfig = { ...config, ...newConfig };
      
      // Immediately update the state for UI responsiveness
      setConfig(updatedConfig);
      applyConfigToCSS(updatedConfig);
      localStorage.setItem('visual_config', JSON.stringify(updatedConfig));
      
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
          await saveConfigToDatabase(
            configType, 
            updatedConfig[key as keyof VisualConfig],
            oldConfig[key as keyof VisualConfig]
          );
        }
      }

      setPreviewMode(false);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving visual config:', error);
      toast.error('Error al guardar la configuración');
      // Revert on error
      setConfig(config);
      applyConfigToCSS(config);
      localStorage.setItem('visual_config', JSON.stringify(config));
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
    let unsubscribe: (() => void) | undefined;
    
    const setupSubscription = async () => {
      await loadConfig();
      unsubscribe = subscribeToConfigChanges(loadConfig);
    };
    
    setupSubscription();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Apply config on mount and when config changes
  useEffect(() => {
    applyConfigToCSS(config);
  }, [config]);

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
