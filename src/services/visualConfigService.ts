
import { supabase } from '@/integrations/supabase/client';
import { VisualConfig } from '@/types/visualConfig';

// Create content history entry
export const createHistoryEntry = async (sectionName: string, oldContent: any, newContent: any, changeType: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('content_history')
      .insert({
        section_name: sectionName,
        old_content: oldContent,
        new_content: newContent,
        change_type: changeType,
        changed_by: user.id
      });
  } catch (error) {
    console.error('Error creating history entry:', error);
  }
};

// Load configuration from database
export const loadConfigFromDatabase = async () => {
  const { data, error } = await supabase
    .from('site_visual_config')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  return data;
};

// Save configuration to database
export const saveConfigToDatabase = async (configType: string, configData: any, oldData: any) => {
  const { error } = await supabase
    .from('site_visual_config')
    .upsert({
      config_type: configType,
      config_data: configData,
      is_active: true,
    }, {
      onConflict: 'config_type,is_active'
    });

  if (error) throw error;

  // Create history entry
  await createHistoryEntry(
    `visual_config_${configType}`,
    oldData,
    configData,
    'update'
  );
};

// Set up real-time subscription
export const subscribeToConfigChanges = (callback: () => void) => {
  const channel = supabase
    .channel('visual-config-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'site_visual_config'
      },
      callback
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
};
