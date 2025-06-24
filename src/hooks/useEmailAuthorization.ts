
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
        user_email: email,
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

  // Verificar si un email está autorizado - función mejorada
  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    try {
      console.log('Checking email authorization for:', email);
      
      // Primer intento: usar la función RPC
      const { data: rpcResult, error: rpcError } = await supabase.rpc('is_email_authorized', {
        user_email: email.toLowerCase().trim()
      });

      if (!rpcError && rpcResult !== null) {
        console.log('RPC result:', rpcResult);
        return rpcResult;
      }

      // Segundo intento: consulta directa como fallback
      const { data: directResult, error: directError } = await supabase
        .from('authorized_emails')
        .select('id, is_active')
        .eq('email', email.toLowerCase().trim())
        .eq('is_active', true)
        .limit(1);

      if (directError) {
        console.error('Direct query error:', directError);
        return false;
      }

      const isAuthorized = directResult && directResult.length > 0;
      console.log('Direct query result:', { directResult, isAuthorized });
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
