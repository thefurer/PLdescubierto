
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteContent {
  id: string;
  section_name: string;
  content: any;
  updated_at: string;
  updated_by?: string;
}

export const useContentManager = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      console.log('Fetching content from database...');
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section_name');

      if (error) {
        console.error('Error fetching content:', error);
        throw error;
      }
      
      console.log('Fetched content:', data);
      setContent(data || []);
    } catch (error: any) {
      console.error('Failed to fetch content:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el contenido',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (sectionName: string, newContent: any) => {
    setSaving(true);
    try {
      console.log('Updating content for section:', sectionName, newContent);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('site_content')
        .update({ 
          content: newContent,
          updated_by: user?.id 
        })
        .eq('section_name', sectionName);

      if (error) {
        console.error('Error updating content:', error);
        throw error;
      }

      console.log('Content updated successfully');
      toast({
        title: 'Éxito',
        description: 'Contenido actualizado correctamente',
      });

      // Refresh content immediately
      await fetchContent();
    } catch (error: any) {
      console.error('Failed to update content:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el contenido',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const createContent = async (sectionName: string, newContent: any) => {
    setSaving(true);
    try {
      console.log('Creating content for section:', sectionName, newContent);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('site_content')
        .insert({ 
          section_name: sectionName,
          content: newContent,
          updated_by: user?.id 
        });

      if (error) {
        console.error('Error creating content:', error);
        throw error;
      }

      console.log('Content created successfully');
      toast({
        title: 'Éxito',
        description: 'Contenido creado correctamente',
      });

      await fetchContent();
    } catch (error: any) {
      console.error('Failed to create content:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el contenido',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchContent();

    // Set up real-time subscription
    const channel = supabase
      .channel('site-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    content,
    loading,
    saving,
    updateContent,
    createContent,
    fetchContent
  };
};
