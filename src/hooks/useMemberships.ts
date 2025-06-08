
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Membership {
  id: string;
  user_id: string;
  type: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'expired';
  start_date: string;
  end_date?: string;
  features: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useMemberships = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createMembership = async (membershipData: Partial<Membership>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('memberships')
        .insert([{ ...membershipData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Membresía creada',
        description: 'La membresía se ha creado exitosamente'
      });

      await fetchMemberships();
      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateMembership = async (id: string, updates: Partial<Membership>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('memberships')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Membresía actualizada',
        description: 'Los cambios se han guardado exitosamente'
      });

      await fetchMemberships();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return {
    memberships,
    loading,
    fetchMemberships,
    createMembership,
    updateMembership
  };
};
