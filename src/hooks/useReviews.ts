
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Review {
  id: string;
  user_id: string;
  attraction_id?: string;
  rating: number;
  title: string;
  content: string;
  is_verified: boolean;
  verification_method?: 'visit_confirmation' | 'photo_verification' | 'admin_verified';
  visit_date?: string;
  photos: string[];
  helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchReviews = async (attractionId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (attractionId) {
        query = query.eq('attraction_id', attractionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
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

  const createReview = async (reviewData: Partial<Review>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...reviewData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Reseña enviada',
        description: 'Tu reseña está siendo revisada y será publicada pronto'
      });

      await fetchReviews();
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

  const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Reseña actualizada',
        description: `La reseña ha sido ${status === 'approved' ? 'aprobada' : 'rechazada'}`
      });

      await fetchReviews();
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
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    fetchReviews,
    createReview,
    updateReviewStatus
  };
};
