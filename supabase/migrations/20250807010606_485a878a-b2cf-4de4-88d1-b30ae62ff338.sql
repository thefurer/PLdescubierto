-- Fix the function to match actual column types: email is varchar(255) but full_name is text
DROP FUNCTION IF EXISTS public.get_admin_users_with_permissions();

CREATE OR REPLACE FUNCTION public.get_admin_users_with_permissions()
 RETURNS TABLE(id uuid, email character varying(255), full_name text, created_at timestamp with time zone, permissions jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Solo el administrador principal puede acceder
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede ver usuarios administradores';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    COALESCE(p.full_name, au.email::text) as full_name,
    ur.created_at,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'section_name', ap.section_name,
            'can_view', ap.can_view,
            'can_edit', ap.can_edit,
            'can_delete', ap.can_delete,
            'granted_at', ap.granted_at
          )
        )
        FROM admin_permissions ap
        WHERE ap.user_id = au.id AND ap.is_active = true
      ),
      '[]'::jsonb
    ) as permissions
  FROM auth.users au
  JOIN user_roles ur ON au.id = ur.user_id
  LEFT JOIN profiles p ON au.id = p.id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at;
END;
$function$;