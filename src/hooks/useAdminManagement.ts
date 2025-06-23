
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  permissions?: AdminPermission[];
}

interface AdminPermission {
  id: string;
  section_name: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  granted_at: string;
}

interface AdminAction {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_email: string;
  action_type: string;
  target_table: string | null;
  target_id: string | null;
  details: any;
  created_at: string;
}

interface AuthorizedEmail {
  id: string;
  email: string;
  authorized_by: string;
  authorized_at: string;
  is_active: boolean;
  notes: string | null;
}

export const useAdminManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [authorizedEmails, setAuthorizedEmails] = useState<AuthorizedEmail[]>([]);

  // Verificar si el usuario actual es el admin principal
  useEffect(() => {
    const checkMainAdmin = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('is_main_admin', {
          user_id: user.id
        });

        if (error) throw error;
        setIsMainAdmin(data || false);
      } catch (error) {
        console.error('Error checking main admin status:', error);
        setIsMainAdmin(false);
      }
    };

    checkMainAdmin();
  }, [user]);

  // Cargar usuarios administradores
  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, created_at')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      // Obtener información de usuarios desde auth.users usando una función RPC
      const userIds = roles.map(role => role.user_id);
      
      const users: AdminUser[] = [];
      for (const userId of userIds) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
        if (!userError && userData.user) {
          users.push({
            id: userData.user.id,
            email: userData.user.email || '',
            full_name: userData.user.user_metadata?.full_name || userData.user.email || '',
            created_at: userData.user.created_at || '',
          });
        }
      }

      setAdminUsers(users);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios administradores',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial de acciones
  const loadAdminActions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('admin_actions_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Enriquecer con información del administrador
      const enrichedActions: AdminAction[] = [];
      for (const action of data) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(action.admin_id);
        if (!userError && userData.user) {
          enrichedActions.push({
            ...action,
            admin_name: userData.user.user_metadata?.full_name || userData.user.email || '',
            admin_email: userData.user.email || ''
          });
        }
      }

      setAdminActions(enrichedActions);
    } catch (error) {
      console.error('Error loading admin actions:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el historial de acciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar emails autorizados
  const loadAuthorizedEmails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('*')
        .order('authorized_at', { ascending: false });

      if (error) throw error;
      setAuthorizedEmails(data || []);
    } catch (error) {
      console.error('Error loading authorized emails:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los emails autorizados',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Autorizar email
  const authorizeEmail = async (email: string, notes?: string) => {
    try {
      setLoading(true);
      
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
      console.error('Error authorizing email:', error);
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
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('authorized_emails')
        .update({ is_active: false })
        .eq('id', emailId);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Autorización de email revocada',
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error revoking email authorization:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo revocar la autorización',
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
    } catch (error) {
      console.error('Error checking email authorization:', error);
      return false;
    }
  };

  // Asignar permisos
  const assignPermissions = async (
    userId: string,
    section: string,
    permissions: { can_view: boolean; can_edit: boolean; can_delete: boolean }
  ) => {
    try {
      setLoading(true);
      
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

      await loadAdminUsers();
    } catch (error: any) {
      console.error('Error assigning permissions:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron asignar los permisos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isMainAdmin,
    adminUsers,
    adminActions,
    authorizedEmails,
    loadAdminUsers,
    loadAdminActions,
    loadAuthorizedEmails,
    authorizeEmail,
    revokeEmailAuthorization,
    checkEmailAuthorization,
    assignPermissions
  };
};
