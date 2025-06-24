
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
      
      console.log('Loaded authorized emails:', data);
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

  // Verificar si un email está autorizado - versión mejorada
  const checkEmailAuthorization = async (email: string): Promise<boolean> => {
    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log('=== EMAIL AUTHORIZATION CHECK ===');
      console.log('Original email:', email);
      console.log('Cleaned email:', cleanEmail);
      
      // Primero, verificar todos los emails autorizados para debug
      const { data: allEmails, error: allError } = await supabase
        .from('authorized_emails')
        .select('email, is_active');
      
      console.log('All authorized emails in database:', allEmails);
      console.log('All emails query error:', allError);
      
      // Ahora la consulta específica
      const { data, error } = await supabase
        .from('authorized_emails')
        .select('id, email, is_active')
        .eq('email', cleanEmail)
        .eq('is_active', true);

      console.log('Specific query response:', { data, error });
      console.log('Query parameters used:', { email: cleanEmail, is_active: true });

      if (error) {
        console.error('Database query error:', error);
        return false;
      }

      const isAuthorized = data && data.length > 0;
      console.log('Authorization result:', isAuthorized);
      
      // Si no está autorizado, intentar también con la función RPC como respaldo
      if (!isAuthorized) {
        console.log('Trying RPC function as fallback...');
        try {
          const { data: rpcResult, error: rpcError } = await supabase.rpc('is_email_authorized', {
            user_email: cleanEmail
          });
          
          console.log('RPC function result:', { rpcResult, rpcError });
          
          if (!rpcError && rpcResult) {
            console.log('RPC function confirms authorization');
            console.log('=== END EMAIL AUTHORIZATION CHECK ===');
            return true;
          }
        } catch (rpcErr) {
          console.log('RPC function failed:', rpcErr);
        }
      }
      
      console.log('=== END EMAIL AUTHORIZATION CHECK ===');
      return isAuthorized;
      
    } catch (error) {
      console.error('Error in checkEmailAuthorization:', error);
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
