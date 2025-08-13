-- Fix admin_actions_log security by implementing proper RLS policies

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admins can view their own actions" ON public.admin_actions_log;

-- Create more restrictive policies

-- 1. Admins can only view their own actions (not all admin actions)
CREATE POLICY "Admins can view only their own actions" 
ON public.admin_actions_log 
FOR SELECT 
USING (
  admin_id = auth.uid() 
  AND is_admin(auth.uid())
);

-- 2. Only main admin can view all admin actions (for oversight)
CREATE POLICY "Main admin can view all actions" 
ON public.admin_actions_log 
FOR SELECT 
USING (is_main_admin(auth.uid()));

-- 3. Keep the existing insert policy but make it more explicit
DROP POLICY IF EXISTS "All admins can insert their actions" ON public.admin_actions_log;

CREATE POLICY "Admins can insert their own actions" 
ON public.admin_actions_log 
FOR INSERT 
WITH CHECK (
  admin_id = auth.uid() 
  AND is_admin(auth.uid())
);

-- 4. Create a secure function for main admin to access all admin actions
CREATE OR REPLACE FUNCTION public.get_all_admin_actions_secure()
RETURNS TABLE(
  id uuid, 
  admin_id uuid, 
  admin_email character varying, 
  admin_name character varying, 
  action_type text, 
  target_table text, 
  target_id uuid, 
  details jsonb, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only main admin can access all admin actions
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Only main admin can view all admin actions';
  END IF;
  
  -- Log this sensitive access
  PERFORM public.log_admin_action(
    'view_all_admin_actions',
    'admin_actions_log',
    NULL,
    jsonb_build_object(
      'accessed_by', auth.uid(), 
      'timestamp', now(),
      'security_level', 'full_admin_audit'
    )
  );
  
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