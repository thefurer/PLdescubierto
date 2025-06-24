
import { supabase } from '@/integrations/supabase/client';

// Hook de respaldo para verificar autorización de email
export const checkEmailAuthorizationFallback = async (email: string): Promise<boolean> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    console.log('Using fallback email authorization check for:', cleanEmail);
    
    // Consulta directa a la tabla authorized_emails
    const { data, error } = await supabase
      .from('authorized_emails')
      .select('id, email, is_active')
      .eq('email', cleanEmail)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Fallback authorization check error:', error);
      return false;
    }

    const isAuthorized = data !== null;
    console.log('Fallback authorization result:', { 
      email: cleanEmail, 
      isAuthorized, 
      foundData: data 
    });
    
    return isAuthorized;
  } catch (error) {
    console.error('Error in fallback authorization check:', error);
    return false;
  }
};
