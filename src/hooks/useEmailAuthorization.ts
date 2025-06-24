
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthorizedEmail {
  id: string;
  email: string;
  authorized_by: string;
  authorized_at: string;
  is_active: boolean;
  notes: string | null;
}

export const useEmailAuthorization = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authorizedEmails, setAuthorizedEmails] = useState<AuthorizedEmail[]>([]);

  // Cargar emails autorizados
  const loadAuthorizedEmails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('*')
        .order('authorized_at', { ascending: false });

      if (error) throw error;
      setAuthorizedEmails(data || []);
    } catch (error) {
      console.error('Error loading authorized emails:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los emails autorizados',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Autorizar email
  const authorizeEmail = async (email: string, notes?: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('authorize_email', {
        user_email: email.toLowerCase().trim(),
        notes: notes || null
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: `Email ${email} autorizado correctamente`,
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error authorizing email:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo autorizar el email',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Revocar autorización de email
  const revokeEmailAuthorization = async (emailId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('authorized_emails')
        .update({ is_active: false })
        .eq('id', emailId);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Autorización de email revocada',
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error revoking email authorization:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo revocar la autorización',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un email está autorizado - versión simplificada y más confiable
  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log('Checking email authorization for:', cleanEmail);
      
      // Consulta directa simple
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('id, email, is_active')
        .eq('email', cleanEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking email authorization:', error);
        return false;
      }

      const isAuthorized = data !== null;
      console.log('Email authorization result:', { 
        email: cleanEmail, 
        isAuthorized, 
        foundData: data 
      });
      
      return isAuthorized;
    } catch (error) {
      console.error('Error checking email authorization:', error);
      return false;
    }
  };

  return {
    loading,
    authorizedEmails,
    loadAuthorizedEmails,
    authorizeEmail,
    revokeEmailAuthorization,
    checkEmailAuthorization
  };
};
