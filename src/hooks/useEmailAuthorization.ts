
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

  // Verificar si un email está autorizado - versión simplificada y mejorada
  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    if (!email || email.trim().length === 0) {
      console.log('Empty email provided for authorization check');
      return false;
    }

    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log('=== EMAIL AUTHORIZATION CHECK ===');
      console.log('Checking authorization for:', cleanEmail);
      
      // Intentar primero con la función RPC
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('is_email_authorized', {
          user_email: cleanEmail
        });
        
        console.log('RPC function result:', { rpcResult, rpcError });
        
        if (!rpcError && typeof rpcResult === 'boolean') {
          console.log('RPC authorization result:', rpcResult);
          console.log('=== END EMAIL AUTHORIZATION CHECK ===');
          return rpcResult;
        }
        
        console.log('RPC function failed or returned invalid result, trying direct query');
      } catch (rpcErr) {
        console.log('RPC function error:', rpcErr);
      }
      
      // Fallback a consulta directa
      const { data, error, count } = await supabase
        .from('authorized_emails')
        .select('id, email, is_active', { count: 'exact' })
        .eq('email', cleanEmail)
        .eq('is_active', true);

      console.log('Direct query result:', { 
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
    checkEmailAuthorization
  };
};
