-- Eliminar cualquier rol de admin existente para otros usuarios y establecer charlott35@sdiussc.com como el admin principal
DELETE FROM public.user_roles WHERE role = 'admin';

-- Insertar charlott35@sdiussc.com como el primer y único admin (será el main admin)
INSERT INTO public.user_roles (user_id, role, created_at)
SELECT 
  id, 
  'admin'::app_role, 
  '2025-01-01 00:00:00+00'::timestamp with time zone  -- Fecha muy temprana para asegurar que sea el primero
FROM auth.users 
WHERE email = 'charlott35@sdiussc.com';

-- Verificar que se insertó correctamente
SELECT 
  u.email,
  ur.role,
  ur.created_at,
  public.is_main_admin(ur.user_id) as is_main_admin
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role = 'admin'
ORDER BY ur.created_at;