
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function getContactInfo() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data: footerData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_name', 'footer')
      .single();

    return footerData?.content || {};
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return {};
  }
}
