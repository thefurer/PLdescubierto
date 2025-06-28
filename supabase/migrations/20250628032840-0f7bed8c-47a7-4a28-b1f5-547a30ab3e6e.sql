
-- Agregar campo de recomendaciones a la tabla tourist_attractions
ALTER TABLE public.tourist_attractions 
ADD COLUMN recommendations TEXT;

-- Actualizar el trigger para manejar el campo updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.tourist_attractions;
CREATE TRIGGER handle_updated_at 
    BEFORE UPDATE ON public.tourist_attractions 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
