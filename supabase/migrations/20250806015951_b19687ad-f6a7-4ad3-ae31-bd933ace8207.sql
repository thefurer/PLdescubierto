-- Corregir la función is_main_admin usando IDs específicos para evitar problemas de permisos
CREATE OR REPLACE FUNCTION public.is_main_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $$
  SELECT user_id IN (
    -- IDs específicos de charlott35@sdiussc.com y abelairton@gmail.com
    '283b168a-fa71-4bcc-920a-65b6df9c7099'::uuid,
    '29c5d4b4-8412-4c07-b6ce-e9b974176d0b'::uuid
  ) OR user_id = (
    -- O si es el primer admin histórico como fallback
    SELECT ur.user_id 
    FROM public.user_roles ur
    WHERE ur.role = 'admin' 
    ORDER BY ur.created_at 
    LIMIT 1
  )
$$;