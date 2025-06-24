
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePermissionsManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    assignPermissions
  };
};
