
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentHistory {
  id: string;
  content_id?: string;
  section_name: string;
  old_content?: any;
  new_content?: any;
  change_type: string;
  changed_by?: string;
  changed_by_name?: string;
  changed_at: string;
}

export const useContentHistory = (sectionName?: string) => {
  const [history, setHistory] = useState<ContentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        setHistory([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('content_history')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .eq('changed_by', user.id) // Only show history for current user
        .order('changed_at', { ascending: false });

      if (sectionName) {
        query = query.eq('section_name', sectionName);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to include user names
      const transformedData = (data || []).map(item => ({
        ...item,
        changed_by_name: item.profiles?.full_name || item.profiles?.email || 'Usuario desconocido'
      }));
      
      setHistory(transformedData);
    } catch (error: any) {
      console.error('Error fetching history:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el historial',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const revertToVersion = async (historyItem: ContentHistory) => {
    try {
      if (!historyItem.old_content) {
        toast({
          title: 'Error',
          description: 'No hay contenido anterior para revertir',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('site_content')
        .update({ 
          content: historyItem.old_content,
          updated_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('section_name', historyItem.section_name);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Contenido revertido correctamente',
      });

      // Refresh history after reverting
      await fetchHistory();

    } catch (error: any) {
      console.error('Error reverting content:', error);
      toast({
        title: 'Error',
        description: 'No se pudo revertir el contenido',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [sectionName]);

  return {
    history,
    loading,
    revertToVersion,
    fetchHistory
  };
};
