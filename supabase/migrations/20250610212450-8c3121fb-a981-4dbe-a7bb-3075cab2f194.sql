
-- Primero, vamos a verificar si existe algún trigger problemático en la tabla tourist_attractions
-- y removerlo si está causando conflictos

-- Verificar triggers existentes en tourist_attractions
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'tourist_attractions';

-- Si existe un trigger que referencie 'section_name', lo removemos
DROP TRIGGER IF EXISTS create_content_history_trigger ON public.tourist_attractions;

-- Verificar que la tabla tourist_attractions tenga la estructura correcta
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tourist_attractions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Asegurar que el trigger updated_at funcione correctamente
DROP TRIGGER IF EXISTS handle_updated_at_trigger ON public.tourist_attractions;

CREATE TRIGGER handle_updated_at_trigger
  BEFORE UPDATE ON public.tourist_attractions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Verificar que no haya restricciones problemáticas
SELECT conname, contype, confupdtype, confdeltype 
FROM pg_constraint 
WHERE conrelid = 'public.tourist_attractions'::regclass;
