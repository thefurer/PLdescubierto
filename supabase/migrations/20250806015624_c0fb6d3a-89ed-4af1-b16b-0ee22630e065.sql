-- Modificar la función is_main_admin para permitir que ambos usuarios específicos tengan acceso de super admin
CREATE OR REPLACE FUNCTION public.is_main_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    -- Verificar si el usuario es charlott35@sdiussc.com o abelairton@gmail.com
    SELECT 1 
    FROM auth.users au 
    WHERE au.id = user_id 
    AND au.email IN ('charlott35@sdiussc.com', 'abelairton@gmail.com')
  ) OR user_id = (
    -- O si es el primer admin histórico como fallback
    SELECT ur.user_id 
    FROM public.user_roles ur
    WHERE ur.role = 'admin' 
    ORDER BY ur.created_at 
    LIMIT 1
  )
$$;