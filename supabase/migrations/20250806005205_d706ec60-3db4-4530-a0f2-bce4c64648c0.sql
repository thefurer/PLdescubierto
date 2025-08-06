-- Crear función para reactivar emails autorizados
CREATE OR REPLACE FUNCTION public.reactivate_authorized_email(email_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Verificar que el usuario actual es el admin principal
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede reactivar emails';
  END IF;
  
  -- Reactivar el email
  UPDATE public.authorized_emails 
  SET is_active = true, authorized_at = now(), authorized_by = auth.uid()
  WHERE id = email_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Email no encontrado';
  END IF;
  
  -- Registrar la acción
  PERFORM public.log_admin_action(
    'reactivate_email',
    'authorized_emails',
    email_id,
    jsonb_build_object('action', 'reactivated')
  );
END;
$function$;

-- Crear función para eliminar emails permanentemente
CREATE OR REPLACE FUNCTION public.delete_authorized_email(email_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Verificar que el usuario actual es el admin principal
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede eliminar emails';
  END IF;
  
  -- Registrar la acción antes de eliminar
  PERFORM public.log_admin_action(
    'delete_email',
    'authorized_emails',
    email_id,
    jsonb_build_object('action', 'deleted_permanently')
  );
  
  -- Eliminar el email permanentemente
  DELETE FROM public.authorized_emails 
  WHERE id = email_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Email no encontrado';
  END IF;
END;
$function$;

-- Crear función para actualizar notas de emails autorizados
CREATE OR REPLACE FUNCTION public.update_authorized_email_notes(email_id uuid, new_notes text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Verificar que el usuario actual es el admin principal
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede actualizar notas';
  END IF;
  
  -- Actualizar las notas
  UPDATE public.authorized_emails 
  SET notes = new_notes
  WHERE id = email_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Email no encontrado';
  END IF;
  
  -- Registrar la acción
  PERFORM public.log_admin_action(
    'update_email_notes',
    'authorized_emails',
    email_id,
    jsonb_build_object('notes', new_notes)
  );
END;
$function$;

-- Mejorar la función assign_admin_role para verificar autorización primero
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    target_user_id uuid;
    clean_email text;
BEGIN
    -- Limpiar y normalizar el email
    clean_email := LOWER(TRIM(user_email));
    
    -- Verificar que el email está autorizado
    IF NOT public.is_email_authorized(clean_email) THEN
        RAISE EXCEPTION 'El email % no está autorizado para registrarse. Debe autorizarlo primero en la sección de Emails Autorizados.', clean_email;
    END IF;
    
    -- Buscar usuario por email en auth.users
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = clean_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario con email % no encontrado. El usuario debe registrarse primero en la plataforma antes de asignarle el rol de administrador.', clean_email;
    END IF;
    
    -- Insertar rol de admin (ON CONFLICT DO NOTHING previene duplicados)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Registrar la acción
    PERFORM public.log_admin_action(
        'assign_admin_role',
        'user_roles',
        target_user_id,
        jsonb_build_object('email', clean_email, 'role', 'admin')
    );
END;
$function$;