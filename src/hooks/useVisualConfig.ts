
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { VisualConfig, defaultConfig } from '@/types/visualConfig';
import { applyConfigToCSS } from '@/utils/cssUtils';
import { loadConfigFromDatabase, saveConfigToDatabase, subscribeToConfigChanges } from '@/services/visualConfigService';

export const useVisualConfig = () => {
  const [config, setConfig] = useState<VisualConfig>(defaultConfig);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [previewMode, setPreviewMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load configuration from database
  const loadConfig = async () => {
    try {
      console.log('Loading visual config from database...');
      const data = await loadConfigFromDatabase();
      console.log('Database config data:', data);

      let mergedConfig = { ...defaultConfig };
      
      // If we have data from database, merge it
      if (data && data.length > 0) {
        data.forEach(configItem => {
          const configData = configItem.config_data as any;
          console.log(`Processing ${configItem.config_type}:`, configData);
          
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
      } else {
        // If no database config, try localStorage as fallback
        const savedConfig = localStorage.getItem('visual_config');
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig);
            mergedConfig = { ...defaultConfig, ...parsedConfig };
            console.log('Using localStorage config as fallback');
          } catch (e) {
            console.error('Error parsing localStorage config:', e);
          }
        }
      }

      console.log('Final merged config:', mergedConfig);
      setConfig(mergedConfig);
      applyConfigToCSS(mergedConfig);
      
      // Store in localStorage for persistence across sessions
      localStorage.setItem('visual_config', JSON.stringify(mergedConfig));
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading visual config:', error);
      
      // Try to use localStorage as fallback
      const savedConfig = localStorage.getItem('visual_config');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig({ ...defaultConfig, ...parsedConfig });
          applyConfigToCSS({ ...defaultConfig, ...parsedConfig });
          console.log('Using localStorage config due to database error');
        } catch (e) {
          console.error('Error parsing localStorage config:', e);
          setConfig(defaultConfig);
          applyConfigToCSS(defaultConfig);
        }
      } else {
        setConfig(defaultConfig);
        applyConfigToCSS(defaultConfig);
      }
      
      setIsInitialized(true);
      
      // Don't show error toast for users who are not logged in
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
      unsubscribe = subscribeToConfigChanges(() => {
        console.log('Visual config changed, reloading...');
        loadConfig();
      });
    };
    
    setupSubscription();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Apply config when it changes (but only after initialization)
  useEffect(() => {
    if (isInitialized) {
      applyConfigToCSS(config);
    }
  }, [config, isInitialized]);

  return {
    config,
    loading,
    previewMode,
    isInitialized,
    saveConfig,
    previewConfig,
    resetPreview,
    loadConfig,
  };
};
