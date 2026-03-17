
-- Drop the old restrictive policy on authorized_emails
DROP POLICY IF EXISTS "Only main admin can manage authorized emails" ON public.authorized_emails;

-- Create new policy using is_main_admin() function which includes both admin UUIDs
CREATE POLICY "Only main admin can manage authorized emails"
ON public.authorized_emails
FOR ALL
TO public
USING (public.is_main_admin(auth.uid()))
WITH CHECK (public.is_main_admin(auth.uid()));
