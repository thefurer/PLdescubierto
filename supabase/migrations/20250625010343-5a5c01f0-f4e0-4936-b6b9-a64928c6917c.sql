
-- Verificar que la función RPC is_email_authorized existe y funciona correctamente
CREATE OR REPLACE FUNCTION public.is_email_authorized(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.authorized_emails 
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(user_email))
    AND is_active = true
  )
$$;

-- Verificar que el email específico está en la tabla (para debugging)
-- Esta consulta nos ayudará a confirmar el estado actual
SELECT 
  id,
  email,
  LOWER(TRIM(email)) as normalized_email,
  is_active,
  authorized_at,
  authorized_by
FROM public.authorized_emails 
WHERE LOWER(TRIM(email)) = 'castillo-abel4461@unesum.edu.ec';

-- También verificar la función authorize_email para asegurar consistencia
CREATE OR REPLACE FUNCTION public.authorize_email(user_email text, notes text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar que el usuario actual es el admin principal
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede autorizar emails';
  END IF;
  
  -- Insertar email autorizado con normalización
  INSERT INTO public.authorized_emails (email, authorized_by, notes)
  VALUES (LOWER(TRIM(user_email)), auth.uid(), notes)
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
    jsonb_build_object('email', LOWER(TRIM(user_email)), 'notes', notes)
  );
END;
$$;
