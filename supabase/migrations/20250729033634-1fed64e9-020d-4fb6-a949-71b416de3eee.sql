-- Crear tabla para almacenar las calificaciones de atracciones
CREATE TABLE public.attraction_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attraction_id UUID NOT NULL REFERENCES public.tourist_attractions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_attraction_ratings_attraction_id ON public.attraction_ratings(attraction_id);
CREATE INDEX idx_attraction_ratings_user_id ON public.attraction_ratings(user_id);
CREATE INDEX idx_attraction_ratings_ip_address ON public.attraction_ratings(ip_address);

-- Crear constraint único para evitar múltiples ratings del mismo usuario por atracción
-- O mismo IP si no hay usuario logueado
ALTER TABLE public.attraction_ratings 
ADD CONSTRAINT unique_user_rating_per_attraction 
UNIQUE(attraction_id, user_id);

-- Crear constraint único para IPs sin usuario (para usuarios no logueados)
CREATE UNIQUE INDEX unique_ip_rating_per_attraction 
ON public.attraction_ratings(attraction_id, ip_address) 
WHERE user_id IS NULL;

-- Habilitar RLS
ALTER TABLE public.attraction_ratings ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede ver las calificaciones
CREATE POLICY "Anyone can view ratings" 
ON public.attraction_ratings 
FOR SELECT 
USING (true);

-- Política: Usuarios autenticados pueden insertar sus propias calificaciones
CREATE POLICY "Authenticated users can insert their own ratings" 
ON public.attraction_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios anónimos pueden insertar calificaciones (limitado por IP)
CREATE POLICY "Anonymous users can insert ratings" 
ON public.attraction_ratings 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Política: Usuarios pueden actualizar sus propias calificaciones
CREATE POLICY "Users can update their own ratings" 
ON public.attraction_ratings 
FOR UPDATE 
USING (auth.uid() = user_id OR (user_id IS NULL AND ip_address = inet_client_addr()));

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_rating_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_attraction_ratings_updated_at
  BEFORE UPDATE ON public.attraction_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_rating_updated_at();

-- Función para obtener el promedio de calificaciones de una atracción
CREATE OR REPLACE FUNCTION public.get_attraction_rating_average(attraction_uuid UUID)
RETURNS TABLE(
  average_rating NUMERIC,
  total_ratings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating::NUMERIC), 1) as average_rating,
    COUNT(*) as total_ratings
  FROM public.attraction_ratings
  WHERE attraction_id = attraction_uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;