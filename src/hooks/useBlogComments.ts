import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { BlogComment } from '@/types/blog';
import { toast } from 'sonner';

export const useBlogComments = (postId: string) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Organizar comentarios en estructura de árbol (comentarios y respuestas)
      const rootComments = data?.filter(comment => !comment.parent_id) || [];
      const replies = data?.filter(comment => comment.parent_id) || [];
      
      const commentsWithReplies = rootComments.map(comment => ({
        ...comment,
        replies: replies.filter(reply => reply.parent_id === comment.id)
      }));

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string, authorName?: string, authorEmail?: string, parentId?: string) => {
    try {
      setSubmitting(true);
      
      // Moderar el contenido del comentario
      const moderatedContent = await moderateContent(content);
      
      const commentData = {
        post_id: postId,
        content: moderatedContent,
        parent_id: parentId || null,
        ...(user ? { author_id: user.id } : { author_name: authorName, author_email: authorEmail })
      };

      const { data, error } = await supabase
        .from('blog_comments')
        .insert(commentData)
        .select()
        .single();

      if (error) throw error;

      // Verificar si el comentario fue censurado
      if (moderatedContent !== content) {
        toast.warning('Tu comentario ha sido moderado automáticamente');
      } else {
        toast.success('Comentario agregado exitosamente');
      }

      await fetchComments();
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error al agregar el comentario');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const reportComment = async (commentId: string, reason: string, description?: string) => {
    try {
      const { error } = await supabase
        .from('content_reports')
        .insert({
          comment_id: commentId,
          reporter_id: user?.id,
          reason,
          description
        });

      if (error) throw error;
      
      toast.success('Comentario reportado. Será revisado por moderadores.');
    } catch (error) {
      console.error('Error reporting comment:', error);
      toast.error('Error al reportar el comentario');
    }
  };

  const moderateContent = async (content: string): Promise<string> => {
    try {
      const { data, error } = await supabase.rpc('moderate_content', {
        content_text: content
      });

      if (error) throw error;
      return data || content;
    } catch (error) {
      console.error('Error moderating content:', error);
      return content;
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return {
    comments,
    loading,
    submitting,
    addComment,
    reportComment,
    fetchComments
  };
};