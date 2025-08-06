-- Dar permisos de admin a abelairton@gmail.com
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
    au.id, 
    'admin'::app_role,
    now() - interval '1 day'  -- Hacer que sea el segundo admin más antiguo
FROM auth.users au 
WHERE au.email = 'abelairton@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Registrar la acción
INSERT INTO public.admin_actions_log (
    admin_id, 
    action_type, 
    target_table, 
    target_id, 
    details
)
SELECT 
    au.id,
    'assign_admin_role',
    'user_roles',
    au.id,
    jsonb_build_object(
        'email', 'abelairton@gmail.com',
        'role', 'admin',
        'source', 'manual_assignment'
    )
FROM auth.users au 
WHERE au.email = 'abelairton@gmail.com';