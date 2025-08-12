
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TouristAttraction } from '@/types/touristAttractions';
import { touristAttractionsService } from '@/services/touristAttractionsService';
import { useImageUpload } from '@/hooks/useImageUpload';

export const useTouristAttractions = () => {
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { uploading, uploadImage } = useImageUpload();

  const fetchAttractions = async () => {
    try {
      const data = await touristAttractionsService.fetchAttractions();
      console.log('Fetched attractions with recommendations:', data.map(a => ({ name: a.name, recommendations: a.recommendations })));
      setAttractions(data);
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

  const updateAttraction = async (id: string, updates: Partial<TouristAttraction>) => {
    setSaving(true);
    try {
      console.log('Updating attraction with recommendations:', updates.recommendations);
      const updatedAttraction = await touristAttractionsService.updateAttraction(id, updates);
      
      toast({
        title: 'Éxito',
        description: 'Atracción actualizada correctamente',
      });

      // Update local state immediately with the returned data from the database
      setAttractions(prev => prev.map(attraction => 
        attraction.id === id ? {
          ...attraction,
          name: updatedAttraction.name,
          description: updatedAttraction.description,
          category: updatedAttraction.category as 'todo' | 'playa' | 'cultura' | 'naturaleza',
          image_url: updatedAttraction.image_url,
          gallery_images: updatedAttraction.gallery_images || [],
          activities: updatedAttraction.activities || [],
          recommendations: Array.isArray(updatedAttraction.recommendations) 
            ? updatedAttraction.recommendations as TouristAttraction['recommendations']
            : [],
          additional_info: typeof updatedAttraction.additional_info === 'object' && updatedAttraction.additional_info !== null 
            ? updatedAttraction.additional_info as { duration?: string; capacity?: string; price?: string; [key: string]: any; }
            : {},
          display_order: updatedAttraction.display_order,
          is_active: updatedAttraction.is_active,
          updated_at: updatedAttraction.updated_at,
          updated_by: updatedAttraction.updated_by
        } : attraction
      ));
      
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

  const createAttraction = async (attractionData: Partial<TouristAttraction>) => {
    setSaving(true);
    try {
      const newAttraction = await touristAttractionsService.createAttraction(attractionData);
      
      toast({
        title: 'Éxito',
        description: 'Atracción creada correctamente',
      });

      // Add to local state
      setAttractions(prev => [...prev, newAttraction]);
      return newAttraction;
      
    } catch (error: any) {
      console.error('Failed to create attraction:', error);
      
      toast({
        title: 'Error',
        description: 'No se pudo crear la atracción',
        variant: 'destructive'
      });
      
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deleteAttraction = async (id: string) => {
    setSaving(true);
    try {
      await touristAttractionsService.deleteAttraction(id);
      
      toast({
        title: 'Éxito',
        description: 'Atracción eliminada correctamente',
      });

      // Remove from local state
      setAttractions(prev => prev.filter(attraction => attraction.id !== id));
      
    } catch (error: any) {
      console.error('Failed to delete attraction:', error);
      
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la atracción',
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
          // Immediately reflect changes without full refresh for better UX
          if (payload.eventType === 'UPDATE' && payload.new) {
            setAttractions(prev => prev.map(attraction => 
              attraction.id === payload.new.id ? {
                ...attraction,
                name: payload.new.name,
                description: payload.new.description,
                category: payload.new.category as 'todo' | 'playa' | 'cultura' | 'naturaleza',
                image_url: payload.new.image_url,
                gallery_images: payload.new.gallery_images || [],
                activities: payload.new.activities || [],
                recommendations: Array.isArray(payload.new.recommendations)
                  ? payload.new.recommendations as TouristAttraction['recommendations']
                  : [],
                additional_info: typeof payload.new.additional_info === 'object' && payload.new.additional_info !== null 
                  ? payload.new.additional_info as { duration?: string; capacity?: string; price?: string; [key: string]: any; }
                  : {},
                display_order: payload.new.display_order,
                is_active: payload.new.is_active,
                updated_at: payload.new.updated_at,
                updated_by: payload.new.updated_by
              } : attraction
            ));
          }
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
    createAttraction,
    deleteAttraction,
    uploadImage,
    fetchAttractions
  };
};

// Re-export the type for backward compatibility
export type { TouristAttraction };
