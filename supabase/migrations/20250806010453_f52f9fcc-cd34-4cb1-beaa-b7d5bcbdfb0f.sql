-- Función para asignar rol de administrador y activar email autorizado desde EmailAuthorizationManager
CREATE OR REPLACE FUNCTION public.assign_admin_role_and_activate(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
    clean_email text;
    email_record_id uuid;
BEGIN
    -- Solo el administrador principal puede hacer esto
    IF NOT public.is_main_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Solo el administrador principal puede asignar roles desde esta interfaz';
    END IF;
    
    -- Limpiar y normalizar el email
    clean_email := LOWER(TRIM(user_email));
    
    -- Verificar que el email está autorizado
    SELECT id INTO email_record_id
    FROM public.authorized_emails 
    WHERE LOWER(TRIM(email)) = clean_email;
    
    IF email_record_id IS NULL THEN
        RAISE EXCEPTION 'El email % no está en la lista de emails autorizados', clean_email;
    END IF;
    
    -- Activar el email si no está activo
    UPDATE public.authorized_emails 
    SET is_active = true, authorized_at = now(), authorized_by = auth.uid()
    WHERE id = email_record_id AND is_active = false;
    
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
        'assign_admin_role_from_email_manager',
        'user_roles',
        target_user_id,
        jsonb_build_object(
            'email', clean_email, 
            'role', 'admin',
            'activated_email', true,
            'source', 'email_authorization_manager'
        )
    );
END;
$$;