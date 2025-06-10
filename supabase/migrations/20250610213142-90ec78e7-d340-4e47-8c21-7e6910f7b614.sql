
-- Eliminar el trigger problemático que está causando el error
DROP TRIGGER IF EXISTS create_content_history_trigger ON public.tourist_attractions;

-- También eliminemos cualquier otro trigger relacionado con content_history en tourist_attractions
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN 
        SELECT trigger_name, event_object_table
        FROM information_schema.triggers 
        WHERE event_object_table = 'tourist_attractions' 
        AND action_statement LIKE '%create_content_history%'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON public.' || trigger_record.event_object_table;
    END LOOP;
END $$;

-- Verificar que no queden triggers problemáticos
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'tourist_attractions';
