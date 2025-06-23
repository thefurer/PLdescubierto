
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthorizedEmail {
  id: string;
  email: string;
  authorized_by: string;
  authorized_at: string;
  is_active: boolean;
  notes?: string;
}

interface AdminPermission {
  id: string;
  user_id: string;
  section_name: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  granted_by: string;
  granted_at: string;
  is_active: boolean;
  user_email?: string;
  user_name?: string;
}

interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_table?: string;
  target_id?: string;
  details: any;
  created_at: string;
  admin_email?: string;
  admin_name?: string;
}

export const useAdminManagement = () => {
  const [authorizedEmails, setAuthorizedEmails] = useState<AuthorizedEmail[]>([]);
  const [adminPermissions, setAdminPermissions] = useState<AdminPermission[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const { toast } = useToast();

  // Verificar si el usuario actual es el admin principal
  const checkMainAdmin = async () => {
    try {
      const { data, error } = await supabase.rpc('is_main_admin', {
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      if (error) throw error;
      setIsMainAdmin(data || false);
    } catch (error: any) {
      console.error('Error checking main admin status:', error);
      setIsMainAdmin(false);
    }
  };

  // Cargar emails autorizados
  const loadAuthorizedEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('*')
        .order('authorized_at', { ascending: false });

      if (error) throw error;
      setAuthorizedEmails(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los emails autorizados',
        variant: 'destructive'
      });
    }
  };

  // Cargar permisos de administradores
  const loadAdminPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select(`
          *,
          profiles!admin_permissions_user_id_fkey(email, full_name)
        `)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      
      const permissionsWithUserInfo = data?.map(permission => ({
        ...permission,
        user_email: permission.profiles?.email || 'Email no disponible',
        user_name: permission.profiles?.full_name || 'Nombre no disponible'
      })) || [];

      setAdminPermissions(permissionsWithUserInfo);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los permisos de administradores',
        variant: 'destructive'
      });
    }
  };

  // Cargar historial de acciones
  const loadAdminActions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_actions_log')
        .select(`
          *,
          profiles!admin_actions_log_admin_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      const actionsWithUserInfo = data?.map(action => ({
        ...action,
        admin_email: action.profiles?.email || 'Email no disponible',
        admin_name: action.profiles?.full_name || 'Nombre no disponible'
      })) || [];

      setAdminActions(actionsWithUserInfo);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el historial de acciones',
        variant: 'destructive'
      });
    }
  };

  // Autorizar un email
  const authorizeEmail = async (email: string, notes?: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('authorize_email', {
        user_email: email,
        notes: notes || null
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: `Email ${email} autorizado correctamente`,
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo autorizar el email',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Revocar autorización de email
  const revokeEmailAuthorization = async (emailId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('authorized_emails')
        .update({ is_active: false })
        .eq('id', emailId);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Autorización revocada correctamente',
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo revocar la autorización',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Asignar permisos granulares
  const assignSectionPermissions = async (
    userId: string,
    section: string,
    permissions: { can_view: boolean; can_edit: boolean; can_delete: boolean }
  ) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('assign_section_permissions', {
        target_user_id: userId,
        section: section,
        can_view: permissions.can_view,
        can_edit: permissions.can_edit,
        can_delete: permissions.can_delete
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Permisos asignados correctamente',
      });

      await loadAdminPermissions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron asignar los permisos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un email está autorizado
  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_email_authorized', {
        user_email: email
      });

      if (error) throw error;
      return data || false;
    } catch (error: any) {
      console.error('Error checking email authorization:', error);
      return false;
    }
  };

  useEffect(() => {
    checkMainAdmin();
  }, []);

  useEffect(() => {
    if (isMainAdmin) {
      loadAuthorizedEmails();
      loadAdminPermissions();
      loadAdminActions();
    }
  }, [isMainAdmin]);

  return {
    authorizedEmails,
    adminPermissions,
    adminActions,
    loading,
    isMainAdmin,
    authorizeEmail,
    revokeEmailAuthorization,
    assignSectionPermissions,
    checkEmailAuthorization,
    loadAuthorizedEmails,
    loadAdminPermissions,
    loadAdminActions
  };
};
