
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
      
      const { data, error } = await supabase.rpc('get_admin_users_with_permissions');

      if (error) throw error;

      // Transformar datos al formato esperado
      const users: AdminUser[] = data.map((user: any) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        permissions: user.permissions || []
      }));

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
