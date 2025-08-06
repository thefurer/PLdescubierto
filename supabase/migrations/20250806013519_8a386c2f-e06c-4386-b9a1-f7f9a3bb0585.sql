-- Crear función RPC para obtener usuarios administradores con sus permisos
CREATE OR REPLACE FUNCTION public.get_admin_users_with_permissions()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  permissions jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo el administrador principal puede acceder
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede ver usuarios administradores';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    COALESCE(p.full_name, au.email) as full_name,
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
$$;

-- Crear función RPC para obtener historial de acciones con información del administrador
CREATE OR REPLACE FUNCTION public.get_admin_actions_with_user_info()
RETURNS TABLE (
  id uuid,
  admin_id uuid,
  admin_email text,
  admin_name text,
  action_type text,
  target_table text,
  target_id uuid,
  details jsonb,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo administradores pueden ver el historial
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo administradores pueden ver el historial de acciones';
  END IF;
  
  RETURN QUERY
  SELECT 
    aal.id,
    aal.admin_id,
    au.email as admin_email,
    COALESCE(p.full_name, au.email) as admin_name,
    aal.action_type,
    aal.target_table,
    aal.target_id,
    aal.details,
    aal.created_at
  FROM admin_actions_log aal
  LEFT JOIN auth.users au ON aal.admin_id = au.id
  LEFT JOIN profiles p ON au.id = p.id
  ORDER BY aal.created_at DESC
  LIMIT 100;
END;
$$;