
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  category: 'todo' | 'playa' | 'cultura' | 'naturaleza';
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
}

export const useTouristAttractions = () => {
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchAttractions = async () => {
    try {
      console.log('Fetching tourist attractions...');
      const { data, error } = await supabase
        .from('tourist_attractions')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Error fetching attractions:', error);
        throw error;
      }
      
      console.log('Fetched attractions:', data);
      // Type assertion to ensure category is properly typed
      const typedAttractions = (data || []).map(attraction => ({
        ...attraction,
        category: attraction.category as 'todo' | 'playa' | 'cultura' | 'naturaleza'
      }));
      
      setAttractions(typedAttractions);
    } catch (error: any) {
      console.error('Failed to fetch attractions:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las atracciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, attractionId: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${attractionId}-${Date.now()}.${fileExt}`;
      const filePath = `attractions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const updateAttraction = async (id: string, updates: Partial<TouristAttraction>) => {
    setSaving(true);
    try {
      console.log('Updating attraction:', id, updates);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Only include fields that exist in the tourist_attractions table
      const allowedFields = ['name', 'description', 'category', 'image_url', 'display_order', 'is_active'];
      const cleanUpdates = Object.keys(updates).reduce((acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = updates[key as keyof TouristAttraction];
        }
        return acc;
      }, {} as any);

      const { error } = await supabase
        .from('tourist_attractions')
        .update({ 
          ...cleanUpdates,
          updated_by: user?.id 
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating attraction:', error);
        throw error;
      }

      console.log('Attraction updated successfully');
      toast({
        title: 'Éxito',
        description: 'Atracción actualizada correctamente',
      });

      await fetchAttractions();
    } catch (error: any) {
      console.error('Failed to update attraction:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la atracción',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAttractions();

    // Set up real-time subscription
    const channel = supabase
      .channel('tourist-attractions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tourist_attractions'
        },
        (payload) => {
          console.log('Real-time attraction update:', payload);
          fetchAttractions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    attractions,
    loading,
    saving,
    uploading,
    updateAttraction,
    uploadImage,
    fetchAttractions
  };
};
