
-- Cambiar el tipo de la columna recommendations de text a jsonb
ALTER TABLE public.tourist_attractions 
ALTER COLUMN recommendations TYPE jsonb USING 
  CASE 
    WHEN recommendations IS NULL OR recommendations = '' THEN '[]'::jsonb
    ELSE recommendations::jsonb
  END;

-- Establecer un valor por defecto
ALTER TABLE public.tourist_attractions 
ALTER COLUMN recommendations SET DEFAULT '[]'::jsonb;
