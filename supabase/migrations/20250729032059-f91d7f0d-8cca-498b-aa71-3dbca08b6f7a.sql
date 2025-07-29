-- Agregar columna de coordenadas a la tabla tourist_attractions
ALTER TABLE public.tourist_attractions ADD COLUMN coordinates JSONB;

-- Comentario para explicar la estructura: { "lat": -1.5667, "lng": -80.7833 }

-- Agregar coordenadas conocidas a algunas atracciones existentes
UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.2833, "lng": -81.0833}'::jsonb
WHERE name = 'Isla de la Plata';

UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.5667, "lng": -80.6833}'::jsonb
WHERE name ILIKE '%Playa Los Frailes%' OR name ILIKE '%Los Frailes%';

UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.5167, "lng": -80.7167}'::jsonb
WHERE name ILIKE '%Agua Blanca%';

UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.5667, "lng": -80.7833}'::jsonb
WHERE name ILIKE '%Puerto López%' AND category = 'playa';

-- Coordenadas aproximadas para otras atracciones de naturaleza cerca de la costa
UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.4833, "lng": -80.8000}'::jsonb
WHERE name = 'Isla de Salango';

UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.3500, "lng": -80.8500}'::jsonb
WHERE name = 'Islote Pedernales';

UPDATE public.tourist_attractions 
SET coordinates = '{"lat": -1.4000, "lng": -80.8200}'::jsonb
WHERE name = 'Islote La Viuda';