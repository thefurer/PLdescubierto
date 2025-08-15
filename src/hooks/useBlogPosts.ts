import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuthContext';
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`*`)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data as BlogPost[] || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Partial<BlogPost>) => {
    if (!user) {
      toast.error('Debes iniciar sesión para crear publicaciones');
      return null;
    }

    try {
      setCreating(true);
      
      // Moderar el contenido antes de guardar
      const moderatedContent = await moderateContent(postData.content || '');
      const moderatedTitle = await moderateContent(postData.title || '');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          ...postData,
          title: moderatedTitle,
          content: moderatedContent,
          author_id: user.id,
          excerpt: postData.excerpt || moderatedContent.substring(0, 150) + '...'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Publicación creada exitosamente');
      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error al crear la publicación');
      return null;
    } finally {
      setCreating(false);
    }
  };

  const updatePost = async (id: string, postData: Partial<BlogPost>) => {
    try {
      setUpdating(true);
      
      // Moderar el contenido antes de actualizar
      const moderatedContent = postData.content ? await moderateContent(postData.content) : undefined;
      const moderatedTitle = postData.title ? await moderateContent(postData.title) : undefined;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          ...postData,
          ...(moderatedTitle && { title: moderatedTitle }),
          ...(moderatedContent && { content: moderatedContent })
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Publicación actualizada exitosamente');
      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Error al actualizar la publicación');
      return null;
    } finally {
      setUpdating(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Publicación eliminada exitosamente');
      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Error al eliminar la publicación');
      return false;
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
      return content; // Return original content if moderation fails
    }
  };

  const getPostBySlug = (slug: string) => {
    return posts.find(post => 
      post.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') === slug
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    creating,
    updating,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    getPostBySlug,
    moderateContent
  };
};