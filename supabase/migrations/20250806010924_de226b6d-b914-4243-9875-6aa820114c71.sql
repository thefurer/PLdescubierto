-- Autorizar el email charlott35@sdiussc.com y asignarle rol de administrador principal
-- Primero insertamos el email autorizado
INSERT INTO public.authorized_emails (email, authorized_by, notes)
VALUES ('charlott35@sdiussc.com', '00000000-0000-0000-0000-000000000000', 'Super administrador inicial del sistema')
ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  authorized_at = now(),
  notes = 'Super administrador inicial del sistema';

-- Si el usuario ya existe en auth.users, le asignamos el rol directamente
-- Esto se hará cuando el usuario se registre, pero agregamos la lógica por si ya existe
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Buscar si el usuario ya existe
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'charlott35@sdiussc.com';
    
    -- Si existe, asignar rol de admin
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Registrar la acción
        INSERT INTO public.admin_actions_log (admin_id, action_type, target_table, target_id, details)
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            'assign_super_admin',
            'user_roles',
            target_user_id,
            jsonb_build_object('email', 'charlott35@sdiussc.com', 'role', 'admin', 'type', 'super_admin_setup')
        );
    END IF;
END $$;