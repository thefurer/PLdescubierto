
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

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

export const useAdminActions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);

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
        const userData = await adminService.getUserById(action.admin_id);
        if (userData) {
          enrichedActions.push({
            ...action,
            admin_name: userData.full_name,
            admin_email: userData.email
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

  return {
    loading,
    adminActions,
    loadAdminActions
  };
};
