-- Función para limpiar todo el historial de cambios (solo main admin)
CREATE OR REPLACE FUNCTION public.clear_all_content_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo el administrador principal puede limpiar el historial
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede limpiar el historial';
  END IF;
  
  -- Registrar la acción antes de eliminar
  PERFORM public.log_admin_action(
    'clear_all_history',
    'content_history',
    NULL,
    jsonb_build_object(
      'action', 'cleared_all_history',
      'timestamp', now(),
      'cleared_by', auth.uid()
    )
  );
  
  -- Eliminar todos los registros del historial
  DELETE FROM public.content_history;
END;
$$;

-- Función para cambiar el rol de un usuario (admin o user)
CREATE OR REPLACE FUNCTION public.set_user_role(target_email text, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  clean_email text;
BEGIN
  -- Solo el administrador principal puede cambiar roles
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede cambiar roles';
  END IF;
  
  -- Validar el rol
  IF new_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Rol inválido. Use "admin" o "user"';
  END IF;
  
  -- Limpiar y normalizar el email
  clean_email := LOWER(TRIM(target_email));
  
  -- Buscar usuario por email en auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = clean_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario con email % no encontrado. El usuario debe registrarse primero.', clean_email;
  END IF;
  
  -- Eliminar rol actual
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  
  -- Asignar nuevo rol
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role::app_role);
  
  -- Registrar la acción
  PERFORM public.log_admin_action(
    'change_user_role',
    'user_roles',
    target_user_id,
    jsonb_build_object(
      'email', clean_email,
      'new_role', new_role
    )
  );
END;
$$;

-- Función para obtener el rol de un usuario por email
CREATE OR REPLACE FUNCTION public.get_user_role_by_email(target_email text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  user_role text;
BEGIN
  -- Buscar usuario por email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = LOWER(TRIM(target_email));
  
  IF target_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Obtener rol
  SELECT role::text INTO user_role
  FROM public.user_roles
  WHERE user_id = target_user_id
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;