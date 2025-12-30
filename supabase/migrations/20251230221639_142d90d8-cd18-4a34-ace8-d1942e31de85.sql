-- Agregar política para permitir que la función SECURITY DEFINER pueda eliminar
CREATE POLICY "Admin can delete content history"
ON public.content_history
FOR DELETE
USING (public.is_main_admin(auth.uid()));

-- Recrear la función con SET search_path para mayor seguridad
CREATE OR REPLACE FUNCTION public.clear_all_content_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Solo el administrador principal puede limpiar el historial
  IF NOT public.is_main_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo el administrador principal puede limpiar el historial';
  END IF;
  
  -- Registrar la acción antes de eliminar
  PERFORM public.log_admin_action(
    'clear_all_history',
    'content_history',
    NULL,
    jsonb_build_object(
      'action', 'cleared_all_history',
      'timestamp', now(),
      'cleared_by', auth.uid()
    )
  );
  
  -- Eliminar todos los registros del historial usando TRUNCATE (más eficiente y no requiere WHERE)
  TRUNCATE TABLE public.content_history;
END;
$$;