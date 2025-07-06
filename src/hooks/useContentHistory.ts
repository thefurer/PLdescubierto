
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
        .select('*')
        .order('changed_at', { ascending: false });

      if (sectionName) {
        query = query.eq('section_name', sectionName);
      }

      const { data: historyData, error } = await query;

      if (error) throw error;
      
      // Now fetch user profiles for the changed_by users
      const userIds = [...new Set(historyData?.map(item => item.changed_by).filter(Boolean))];
      
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Transform the data to include user names and better formatting
        const transformedData = (historyData || []).map(item => {
          const profile = profiles?.find(p => p.id === item.changed_by);
          let sectionDisplayName = item.section_name;
          
          // Better display names for visual config sections
          if (item.section_name.startsWith('visual_config_')) {
            const configType = item.section_name.replace('visual_config_', '');
            switch (configType) {
              case 'color_palette':
                sectionDisplayName = 'Paleta de Colores';
                break;
              case 'navbar_settings':
                sectionDisplayName = 'Configuración del Navbar';
                break;
              case 'logo_settings':
                sectionDisplayName = 'Configuración del Logo';
                break;
              case 'button_styles':
                sectionDisplayName = 'Estilos de Botones';
                break;
              case 'typography':
                sectionDisplayName = 'Configuración de Tipografía';
                break;
              default:
                sectionDisplayName = 'Diseño Visual';
            }
          } else if (item.section_name === 'hero') {
            sectionDisplayName = 'Sección Principal';
          } else if (item.section_name === 'footer') {
            sectionDisplayName = 'Pie de Página';
          } else if (item.section_name === 'attractions') {
            sectionDisplayName = 'Atracciones';
          }
          
          return {
            ...item,
            section_display_name: sectionDisplayName,
            changed_by_name: profile?.full_name || profile?.email || 'Usuario desconocido'
          };
        });
        
        setHistory(transformedData);
      } else {
        setHistory(historyData || []);
      }
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

      // Handle visual config reverts
      if (historyItem.section_name.startsWith('visual_config_')) {
        const configType = historyItem.section_name.replace('visual_config_', '');
        
        const { error } = await supabase
          .from('site_visual_config')
          .update({ 
            config_data: historyItem.old_content,
            updated_by: (await supabase.auth.getUser()).data.user?.id 
          })
          .eq('config_type', configType)
          .eq('is_active', true);

        if (error) throw error;
      } else {
        // Handle regular content reverts
        const { error } = await supabase
          .from('site_content')
          .update({ 
            content: historyItem.old_content,
            updated_by: (await supabase.auth.getUser()).data.user?.id 
          })
          .eq('section_name', historyItem.section_name);

        if (error) throw error;
      }

      toast({
        title: 'Éxito',
        description: 'Contenido revertido correctamente',
      });

      // Refresh history after reverting
      await fetchHistory();
      
      // Trigger visual config reload if it was a visual config change
      if (historyItem.section_name.startsWith('visual_config_')) {
        window.dispatchEvent(new Event('visual-config-updated'));
      }

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
