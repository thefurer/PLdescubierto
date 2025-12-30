import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';

export type UserRole = 'admin' | 'user' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isMainAdmin, setIsMainAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setIsMainAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check if main admin
        const { data: isMain, error: mainError } = await supabase.rpc('is_main_admin', {
          user_id: user.id
        });

        if (mainError) {
          console.error('Error checking main admin:', mainError);
        } else {
          setIsMainAdmin(isMain || false);
        }

        // Check if admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
          _user_id: user.id
        });

        if (adminError) {
          console.error('Error checking admin role:', adminError);
          setRole('user');
        } else {
          setRole(isAdmin ? 'admin' : 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const canEdit = role === 'admin' || isMainAdmin;
  const isReadOnly = role === 'user' && !isMainAdmin;

  return {
    role,
    isMainAdmin,
    loading,
    canEdit,
    isReadOnly
  };
};
