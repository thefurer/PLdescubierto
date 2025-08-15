import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { BlogReaction } from '@/types/blog';
import { toast } from 'sonner';

export const useBlogReactions = (postId?: string, commentId?: string) => {
  const [reactions, setReactions] = useState<BlogReaction[]>([]);
  const [userReaction, setUserReaction] = useState<BlogReaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReactions = async () => {
    try {
      const query = supabase
        .from('blog_reactions')
        .select('*');

      if (postId) {
        query.eq('post_id', postId);
      } else if (commentId) {
        query.eq('comment_id', commentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setReactions(data as BlogReaction[] || []);
      
      // Encontrar la reacción del usuario actual
      if (user) {
        const currentUserReaction = data?.find(reaction => reaction.user_id === user.id) as BlogReaction;
        setUserReaction(currentUserReaction || null);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReaction = async (reactionType: BlogReaction['reaction_type']) => {
    if (!user) {
      toast.error('Debes iniciar sesión para reaccionar');
      return;
    }

    try {
      // Si ya tiene una reacción del mismo tipo, la eliminamos
      if (userReaction?.reaction_type === reactionType) {
        await removeReaction();
        return;
      }

      // Si tiene una reacción diferente, la actualizamos
      if (userReaction) {
        const { error } = await supabase
          .from('blog_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', userReaction.id);

        if (error) throw error;
      } else {
        // Si no tiene reacción, creamos una nueva
        const reactionData = {
          user_id: user.id,
          reaction_type: reactionType,
          ...(postId ? { post_id: postId } : { comment_id: commentId })
        };

        const { error } = await supabase
          .from('blog_reactions')
          .insert(reactionData);

        if (error) throw error;
      }

      await fetchReactions();
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Error al agregar reacción');
    }
  };

  const removeReaction = async () => {
    if (!userReaction) return;

    try {
      const { error } = await supabase
        .from('blog_reactions')
        .delete()
        .eq('id', userReaction.id);

      if (error) throw error;
      
      await fetchReactions();
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast.error('Error al eliminar reacción');
    }
  };

  const getReactionCounts = () => {
    const counts: Record<BlogReaction['reaction_type'], number> = {
      like: 0,
      love: 0,
      laugh: 0,
      wow: 0,
      sad: 0,
      angry: 0
    };

    reactions.forEach(reaction => {
      counts[reaction.reaction_type]++;
    });

    return counts;
  };

  const getTotalReactions = () => {
    return reactions.length;
  };

  useEffect(() => {
    if (postId || commentId) {
      fetchReactions();
    }
  }, [postId, commentId, user]);

  return {
    reactions,
    userReaction,
    loading,
    addReaction,
    removeReaction,
    getReactionCounts,
    getTotalReactions,
    fetchReactions
  };
};