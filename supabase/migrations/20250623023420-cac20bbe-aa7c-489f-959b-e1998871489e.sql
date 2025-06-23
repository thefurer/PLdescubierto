
-- Crear tabla para correos autorizados
CREATE TABLE public.authorized_emails (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  authorized_by uuid REFERENCES auth.users(id) NOT NULL,
  authorized_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  notes text
);

-- Crear tabla para permisos granulares de administradores
CREATE TABLE public.admin_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  section_name text NOT NULL, -- 'hero', 'footer', 'attractions', 'gallery', etc.
  can_view boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  can_delete boolean NOT NULL DEFAULT false,
  granted_by uuid REFERENCES auth.users(id) NOT NULL,
  granted_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE(user_id, section_name)
);

-- Crear tabla para historial de acciones de administradores
CREATE TABLE public.admin_actions_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) NOT NULL,
  action_type text NOT NULL, -- 'create', 'update', 'delete', 'login', 'permission_change'
  target_table text, -- tabla afectada
  target_id uuid, -- ID del registro afectado
  details jsonb NOT NULL DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.authorized_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para authorized_emails (solo admin principal puede gestionar)
CREATE POLICY "Only main admin can manage authorized emails" 
  ON public.authorized_emails 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND user_id = (
        SELECT user_id FROM public.user_roles 
        WHERE role = 'admin' 
        ORDER BY created_at 
        LIMIT 1
      )
    )
  );

-- Políticas RLS para admin_permissions (solo admin principal puede gestionar)
CREATE POLICY "Only main admin can manage permissions" 
  ON public.admin_permissions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND user_id = (
        SELECT user_id FROM public.user_roles 
        WHERE role = 'admin' 
        ORDER BY created_at 
        LIMIT 1
      )
    )
  );

-- Políticas RLS para admin_actions_log (admins pueden ver, solo main admin puede ver todo)
CREATE POLICY "Admins can view their own actions" 
  ON public.admin_actions_log 
  FOR SELECT 
  USING (
    admin_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND user_id = (
        SELECT user_id FROM public.user_roles 
        WHERE role = 'admin' 
        ORDER BY created_at 
        LIMIT 1
      )
    )
  );

CREATE POLICY "All admins can insert their actions" 
  ON public.admin_actions_log 
  FOR INSERT 
  WITH CHECK (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Función para verificar si un email está autorizado
CREATE OR REPLACE FUNCTION public.is_email_authorized(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.authorized_emails 
    WHERE email = user_email 
    AND is_active = true
  )
$$;

-- Función para verificar si un usuario es el admin principal
CREATE OR REPLACE FUNCTION public.is_main_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT user_id = (
    SELECT ur.user_id 
    FROM public.user_roles ur
    WHERE ur.role = 'admin' 
    ORDER BY ur.created_at 
    LIMIT 1
  )
$$;

-- Función para verificar permisos granulares
CREATE OR REPLACE FUNCTION public.has_section_permission(
  user_id uuid, 
  section text, 
  permission_type text
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT CASE 
    WHEN public.is_main_admin(user_id) THEN true
    ELSE EXISTS (
      SELECT 1 
      FROM public.admin_permissions ap
      WHERE ap.user_id = user_id 
      AND ap.section_name = section 
      AND ap.is_active = true
      AND (
        (permission_type = 'view' AND ap.can_view = true) OR
        (permission_type = 'edit' AND ap.can_edit = true) OR
        (permission_type = 'delete' AND ap.can_delete = true)
      )
    )
  END
$$;

-- Función para registrar acciones de administradores
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type text,
  target_table text DEFAULT NULL,
  target_id uuid DEFAULT NULL,
  details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.admin_actions_log (
    admin_id, 
    action_type, 
    target_table, 
    target_id, 
    details
  )
  VALUES (
    auth.uid(), 
    action_type, 
    target_table, 
    target_id, 
    details
  );
END;
$$;

-- Función para autorizar un email (solo admin principal)
CREATE OR REPLACE FUNCTION public.authorize_email(user_email text, notes text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar que el usuario actual es el admin principal
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede autorizar emails';
  END IF;
  
  -- Insertar email autorizado
  INSERT INTO public.authorized_emails (email, authorized_by, notes)
  VALUES (user_email, auth.uid(), notes)
  ON CONFLICT (email) DO UPDATE SET
    is_active = true,
    authorized_by = auth.uid(),
    authorized_at = now(),
    notes = EXCLUDED.notes;
  
  -- Registrar la acción
  PERFORM public.log_admin_action(
    'authorize_email',
    'authorized_emails',
    NULL,
    jsonb_build_object('email', user_email, 'notes', notes)
  );
END;
$$;

-- Función para asignar permisos granulares
CREATE OR REPLACE FUNCTION public.assign_section_permissions(
  target_user_id uuid,
  section text,
  can_view boolean DEFAULT false,
  can_edit boolean DEFAULT false,
  can_delete boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar que el usuario actual es el admin principal
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede asignar permisos';
  END IF;
  
  -- Insertar o actualizar permisos
  INSERT INTO public.admin_permissions (
    user_id, section_name, can_view, can_edit, can_delete, granted_by
  )
  VALUES (target_user_id, section, can_view, can_edit, can_delete, auth.uid())
  ON CONFLICT (user_id, section_name) DO UPDATE SET
    can_view = EXCLUDED.can_view,
    can_edit = EXCLUDED.can_edit,
    can_delete = EXCLUDED.can_delete,
    granted_by = EXCLUDED.granted_by,
    granted_at = now(),
    is_active = true;
  
  -- Registrar la acción
  PERFORM public.log_admin_action(
    'assign_permissions',
    'admin_permissions',
    target_user_id,
    jsonb_build_object(
      'section', section,
      'permissions', jsonb_build_object(
        'can_view', can_view,
        'can_edit', can_edit,
        'can_delete', can_delete
      )
    )
  );
END;
$$;
