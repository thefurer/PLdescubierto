-- Migración para soporte de configuraciones visuales avanzadas
-- Agregar nuevos tipos de configuración para botones y tipografía

-- Insertar configuraciones por defecto para botones y tipografía
INSERT INTO public.site_visual_config (config_type, config_data) VALUES
('button_styles', jsonb_build_object(
  'primaryStyle', 'rounded',
  'primaryColor', '#2563eb',
  'secondaryColor', '#10b981',
  'hoverEffect', 'scale'
)),
('typography', jsonb_build_object(
  'fontFamily', 'Poppins',
  'headingColor', '#1f2937',
  'bodyColor', '#4b5563',
  'linkColor', '#2563eb'
))
ON CONFLICT (config_type, is_active) DO UPDATE SET
  config_data = EXCLUDED.config_data,
  updated_at = now();