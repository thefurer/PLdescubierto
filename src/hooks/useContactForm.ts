
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitContactForm = async (data: ContactFormData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/functions/v1/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }

      toast({
        title: 'Mensaje enviado',
        description: result.message || 'Tu mensaje ha sido enviado correctamente',
      });

      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Error al enviar el mensaje';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitContactForm,
  };
};
