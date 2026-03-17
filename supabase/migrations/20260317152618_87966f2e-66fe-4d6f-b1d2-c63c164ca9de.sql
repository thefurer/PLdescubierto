
-- Fix admin_permissions policy too
DROP POLICY IF EXISTS "Only main admin can manage permissions" ON public.admin_permissions;

CREATE POLICY "Only main admin can manage permissions"
ON public.admin_permissions
FOR ALL
TO public
USING (public.is_main_admin(auth.uid()))
WITH CHECK (public.is_main_admin(auth.uid()));
