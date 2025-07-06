
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useLogoUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadLogo = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      throw new Error('Invalid file type');
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('El archivo debe ser menor a 2MB');
      throw new Error('File too large');
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadLogo
  };
};
