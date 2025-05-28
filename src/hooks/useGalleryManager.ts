
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GalleryImage {
  id: string;
  title: string;
  alt_text?: string;
  category: string;
  image_url: string;
  storage_path: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  uploaded_by?: string;
}

export const useGalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar las imágenes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, title: string, category: string, altText?: string) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery_images')
        .insert({
          title,
          alt_text: altText,
          category,
          image_url: publicUrl,
          storage_path: filePath,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      toast({
        title: 'Éxito',
        description: 'Imagen subida correctamente',
      });

      await fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('site-images')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: 'Éxito',
        description: 'Imagen eliminada correctamente',
      });

      await fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la imagen',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchImages();

    // Set up real-time subscription
    const channel = supabase
      .channel('gallery-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery_images'
        },
        () => {
          fetchImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    images,
    loading,
    uploading,
    uploadImage,
    deleteImage,
    fetchImages
  };
};
