-- Autorizar el email charlott35@sdiussc.com para que pueda registrarse y ser super administrador
INSERT INTO public.authorized_emails (email, authorized_by, notes)
VALUES ('charlott35@sdiussc.com', '00000000-0000-0000-0000-000000000000', 'Super administrador inicial del sistema - Autorizado para acceso completo')
ON CONFLICT (email) DO UPDATE SET
  is_active = true,
  authorized_at = now(),
  notes = 'Super administrador inicial del sistema - Autorizado para acceso completo';