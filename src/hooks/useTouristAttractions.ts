
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TouristAttraction {
  id: string;
  name: string;
  description: string;
  category: 'todo' | 'playa' | 'cultura' | 'naturaleza';
  image_url?: string;
  gallery_images?: string[];
  activities?: string[];
  additional_info?: {
    duration?: string;
    capacity?: string;
    price?: string;
    [key: string]: any;
  };
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
      const typedAttractions = (data || []).map(attraction => ({
        ...attraction,
        category: attraction.category as 'todo' | 'playa' | 'cultura' | 'naturaleza',
        gallery_images: attraction.gallery_images || [],
        activities: attraction.activities || [],
        additional_info: typeof attraction.additional_info === 'object' && attraction.additional_info !== null 
          ? attraction.additional_info as { duration?: string; capacity?: string; price?: string; [key: string]: any; }
          : {}
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
      console.log('Starting image upload for attraction:', attractionId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${attractionId}-${Date.now()}.${fileExt}`;
      const filePath = `attractions/${fileName}`;

      console.log('Uploading to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', publicUrl);
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
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
      }
      
      // Create update object with only the fields that should be updated
      const updateData: Record<string, any> = {};
      
      // Only include fields that are defined in updates and exist in the database schema
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
      if (updates.gallery_images !== undefined) updateData.gallery_images = updates.gallery_images;
      if (updates.activities !== undefined) updateData.activities = updates.activities;
      if (updates.additional_info !== undefined) updateData.additional_info = updates.additional_info;
      if (updates.display_order !== undefined) updateData.display_order = updates.display_order;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      
      // Add updated_by if user exists
      if (user?.id) {
        updateData.updated_by = user.id;
      }

      console.log('Update data being sent to database:', updateData);

      const { data, error } = await supabase
        .from('tourist_attractions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error details:', error);
        throw error;
      }

      console.log('Attraction updated successfully:', data);
      
      toast({
        title: 'Éxito',
        description: 'Atracción actualizada correctamente',
      });

      // Refresh the attractions list
      await fetchAttractions();
      
      return data;
    } catch (error: any) {
      console.error('Failed to update attraction:', error);
      
      let errorMessage = 'No se pudo actualizar la atracción';
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw error;
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
