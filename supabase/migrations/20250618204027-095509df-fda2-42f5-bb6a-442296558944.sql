
-- Agregar nuevos campos a la tabla tourist_attractions para la información adicional
ALTER TABLE tourist_attractions 
ADD COLUMN IF NOT EXISTS activities TEXT[],
ADD COLUMN IF NOT EXISTS additional_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- Crear tabla para almacenar información detallada de actividades de cada atracción
CREATE TABLE IF NOT EXISTS attraction_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attraction_id UUID REFERENCES tourist_attractions(id) ON DELETE CASCADE,
  activity_name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  difficulty_level TEXT,
  price NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agregar trigger para updated_at en attraction_activities
CREATE OR REPLACE TRIGGER handle_updated_at_attraction_activities
  BEFORE UPDATE ON attraction_activities
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Habilitar RLS en la nueva tabla
ALTER TABLE attraction_activities ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para attraction_activities (solo lectura pública, escritura para admins)
CREATE POLICY "Anyone can view attraction activities" ON attraction_activities
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage attraction activities" ON attraction_activities
  FOR ALL USING (is_admin(auth.uid()));
