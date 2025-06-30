
-- Crear tabla para configuraciones visuales del sitio
CREATE TABLE public.site_visual_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_type TEXT NOT NULL, -- 'color_palette', 'navbar_settings', 'logo_settings'
  config_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(config_type, is_active) -- Solo una configuración activa por tipo
);

-- Habilitar RLS
ALTER TABLE public.site_visual_config ENABLE ROW LEVEL SECURITY;

-- Política para que solo los admins puedan gestionar configuraciones visuales
CREATE POLICY "Only admins can manage visual config" 
  ON public.site_visual_config 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Insertar configuraciones por defecto
INSERT INTO public.site_visual_config (config_type, config_data) VALUES
('color_palette', jsonb_build_object(
  'primary', '#2563eb',
  'secondary', '#10b981', 
  'background', '#ffffff',
  'text', '#1f2937',
  'accent', '#f59e0b'
)),
('navbar_settings', jsonb_build_object(
  'items', jsonb_build_array(
    jsonb_build_object('name', 'Inicio', 'url', '/', 'visible', true, 'order', 1),
    jsonb_build_object('name', 'Atracciones', 'url', '/attractions', 'visible', true, 'order', 2),
    jsonb_build_object('name', 'Galería', 'url', '/gallery', 'visible', true, 'order', 3),
    jsonb_build_object('name', 'Blog', 'url', '/blog', 'visible', true, 'order', 4),
    jsonb_build_object('name', 'Contacto', 'url', '/contact', 'visible', true, 'order', 5)
  )
)),
('logo_settings', jsonb_build_object(
  'position', 'left',
  'size', 'standard',
  'height', 40,
  'margin', 'auto'
));

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_visual_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER visual_config_updated_at
  BEFORE UPDATE ON public.site_visual_config
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_visual_config_updated_at();
