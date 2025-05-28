
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
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section_name');

      if (error) throw error;
      setContent(data || []);
    } catch (error: any) {
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
      const { error } = await supabase
        .from('site_content')
        .update({ 
          content: newContent,
          updated_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('section_name', sectionName);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Contenido actualizado correctamente',
      });

      await fetchContent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el contenido',
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
        () => {
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
    fetchContent
  };
};
