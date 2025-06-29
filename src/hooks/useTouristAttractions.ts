
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
          ...updatedAttraction,
          recommendations: Array.isArray(updatedAttraction.recommendations) 
            ? updatedAttraction.recommendations as TouristAttraction['recommendations']
            : []
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
                ...payload.new,
                gallery_images: payload.new.gallery_images || [],
                activities: payload.new.activities || [],
                recommendations: Array.isArray(payload.new.recommendations)
                  ? payload.new.recommendations as TouristAttraction['recommendations']
                  : [],
                additional_info: typeof payload.new.additional_info === 'object' && payload.new.additional_info !== null 
                  ? payload.new.additional_info as { duration?: string; capacity?: string; price?: string; [key: string]: any; }
                  : {}
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
    uploadImage,
    fetchAttractions
  };
};

// Re-export the type for backward compatibility
export type { TouristAttraction };
