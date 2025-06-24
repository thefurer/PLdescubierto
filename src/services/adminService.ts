
import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  // Verificar si el usuario actual es el admin principal
  checkMainAdmin: async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_main_admin', {
        user_id: userId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking main admin status:', error);
      return false;
    }
  },

  // Obtener información de un usuario por ID
  getUserById: async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !userData.user) return null;
      
      return {
        id: userData.user.id,
        email: userData.user.email || '',
        full_name: userData.user.user_metadata?.full_name || userData.user.email || '',
        created_at: userData.user.created_at || '',
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }
};
