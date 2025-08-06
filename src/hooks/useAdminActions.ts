
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
      
      const { data, error } = await supabase.rpc('get_admin_actions_with_user_info');

      if (error) throw error;

      // Transformar datos al formato esperado
      const actions: AdminAction[] = data.map((action: any) => ({
        id: action.id,
        admin_id: action.admin_id,
        admin_name: action.admin_name,
        admin_email: action.admin_email,
        action_type: action.action_type,
        target_table: action.target_table,
        target_id: action.target_id,
        details: action.details,
        created_at: action.created_at
      }));

      setAdminActions(actions);
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
