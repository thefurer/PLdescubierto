-- Agregar configuración por defecto para el logo
INSERT INTO public.site_visual_config (config_type, config_data) VALUES
('logo_settings', jsonb_build_object(
  'position', 'left',
  'size', 'standard',
  'height', 40,
  'margin', 'auto'
))
ON CONFLICT (config_type, is_active) DO UPDATE SET
  config_data = EXCLUDED.config_data,
  updated_at = now();