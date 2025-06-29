
import { supabase } from '@/integrations/supabase/client';
import { TouristAttraction } from '@/types/touristAttractions';

export const touristAttractionsService = {
  async fetchAttractions(): Promise<TouristAttraction[]> {
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
      recommendations: Array.isArray(attraction.recommendations) 
        ? attraction.recommendations as TouristAttraction['recommendations']
        : [],
      additional_info: typeof attraction.additional_info === 'object' && attraction.additional_info !== null 
        ? attraction.additional_info as { duration?: string; capacity?: string; price?: string; [key: string]: any; }
        : {}
    }));
    
    return typedAttractions;
  },

  async updateAttraction(id: string, updates: Partial<TouristAttraction>) {
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
    if (updates.recommendations !== undefined) {
      // Since recommendations is now jsonb, we can pass the array directly
      updateData.recommendations = updates.recommendations || [];
      console.log('Setting recommendations as jsonb:', updateData.recommendations);
    }
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
    return data;
  }
};
