
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

interface AdminPermission {
  id: string;
  section_name: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  granted_at: string;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  permissions?: AdminPermission[];
}

export const useAdminUsers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  // Cargar usuarios administradores
  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, created_at')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      // Obtener información de usuarios
      const userIds = roles.map(role => role.user_id);
      const users: AdminUser[] = [];
      
      for (const userId of userIds) {
        const userData = await adminService.getUserById(userId);
        if (userData) {
          users.push(userData);
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

  return {
    loading,
    adminUsers,
    loadAdminUsers
  };
};
