
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

      if (error) {
        console.error('Error loading authorized emails:', error);
        throw error;
      }
      
      console.log('Loaded authorized emails:', data?.length || 0);
      setAuthorizedEmails(data || []);
    } catch (error: any) {
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
      
      const cleanEmail = email.toLowerCase().trim();
      console.log('Authorizing email:', cleanEmail);
      
      // Usar la función RPC para autorizar el email
      const { error } = await supabase.rpc('authorize_email', {
        user_email: cleanEmail,
        notes: notes || null
      });

      if (error) {
        console.error('Error in authorize_email RPC:', error);
        throw error;
      }

      toast({
        title: 'Éxito',
        description: `Email ${cleanEmail} autorizado correctamente`,
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

  // Reactivar autorización de email
  const reactivateEmailAuthorization = async (emailId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('reactivate_authorized_email', {
        email_id: emailId
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Email reactivado correctamente',
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error reactivating email authorization:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo reactivar el email',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar email permanentemente
  const deleteEmailPermanently = async (emailId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('delete_authorized_email', {
        email_id: emailId
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Email eliminado permanentemente',
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error deleting email permanently:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el email',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Actualizar notas de email
  const updateEmailNotes = async (emailId: string, notes: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.rpc('update_authorized_email_notes', {
        email_id: emailId,
        new_notes: notes
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Notas actualizadas correctamente',
      });

      await loadAuthorizedEmails();
    } catch (error: any) {
      console.error('Error updating email notes:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron actualizar las notas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un email está autorizado
  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    if (!email || email.trim().length === 0) {
      console.log('Empty email provided for authorization check');
      return false;
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log('=== EMAIL AUTHORIZATION CHECK ===');
      console.log('Checking authorization for:', cleanEmail);
      
      // Primero intentar con la función RPC mejorada
      const { data: rpcResult, error: rpcError } = await supabase.rpc('is_email_authorized', {
        user_email: cleanEmail
      });
      
      console.log('RPC function result:', { rpcResult, rpcError });
      
      if (!rpcError && typeof rpcResult === 'boolean') {
        console.log('RPC authorization successful:', rpcResult);
        console.log('=== END EMAIL AUTHORIZATION CHECK ===');
        return rpcResult;
      }
      
      console.log('RPC function failed, trying direct query fallback');
      
      // Fallback: consulta directa con normalización exacta
      const { data, error, count } = await supabase
        .from('authorized_emails')
        .select('id, email, is_active', { count: 'exact' })
        .eq('email', cleanEmail)
        .eq('is_active', true);

      console.log('Direct query fallback result:', { 
        data, 
        error, 
        count,
        dataLength: data?.length 
      });

      if (error) {
        console.error('Database query error:', error);
        return false;
      }

      const isAuthorized = (data && data.length > 0) || (count && count > 0);
      console.log('Final authorization result:', isAuthorized);
      console.log('=== END EMAIL AUTHORIZATION CHECK ===');
      
      return isAuthorized;
      
    } catch (error) {
      console.error('Error in checkEmailAuthorization:', error);
      console.log('=== END EMAIL AUTHORIZATION CHECK (ERROR) ===');
      return false;
    }
  };

  return {
    loading,
    authorizedEmails,
    loadAuthorizedEmails,
    authorizeEmail,
    revokeEmailAuthorization,
    reactivateEmailAuthorization,
    deleteEmailPermanently,
    updateEmailNotes,
    checkEmailAuthorization
  };
};
