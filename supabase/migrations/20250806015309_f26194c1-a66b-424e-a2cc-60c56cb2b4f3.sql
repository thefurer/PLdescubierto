-- Modificar la función is_main_admin para permitir que ambos usuarios específicos tengan acceso de super admin
CREATE OR REPLACE FUNCTION public.is_main_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT user_id IN (
    -- Permitir acceso a charlott35@sdiussc.com y abelairton@gmail.com
    SELECT au.id 
    FROM auth.users au 
    WHERE au.email IN ('charlott35@sdiussc.com', 'abelairton@gmail.com')
    
    UNION
    
    -- También mantener el acceso al primer admin histórico como fallback
    SELECT ur.user_id 
    FROM public.user_roles ur
    WHERE ur.role = 'admin' 
    ORDER BY ur.created_at 
    LIMIT 1
  )
$$;