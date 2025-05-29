
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY no está configurada');
    }

    // Obtener información de contacto actualizada desde la base de datos
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: footerData } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_name', 'footer')
      .single();

    const contactInfo = footerData?.content || {};

    const systemPrompt = `Eres un asistente de soporte para Puerto López Descubierto, un sitio web de turismo en Puerto López, Ecuador. Tu función es proporcionar guía y soporte a los visitantes.

INFORMACIÓN DE CONTACTO ACTUALIZADA:
- Email: ${contactInfo.email || 'info@puertolopez.descubierto.com'}
- Teléfono: ${contactInfo.phone || '+593 2 123 4567'}
- Dirección: ${contactInfo.address || 'Puerto López, Manabí, Ecuador'}

DIRECTRICES:
- Responde de manera amigable y profesional en español
- Proporciona información sobre Puerto López, sus atracciones turísticas y actividades
- Para consultas específicas de soporte, siempre proporciona los contactos actualizados
- Sugiere los mejores momentos para visitar (temporadas, clima)
- Recomienda actividades como avistamiento de ballenas, buceo, senderismo
- Si no tienes información específica, recomienda contactar directamente

EJEMPLOS DE RESPUESTAS:
- Para soporte técnico o reservas: "Puedes contactarnos en ${contactInfo.email} o llamarnos al ${contactInfo.phone}"
- Para clima: "La mejor época para visitar Puerto López es de junio a septiembre durante la temporada de ballenas"
- Para actividades: "Puerto López ofrece avistamiento de ballenas, buceo en la Isla de la Plata, y senderismo en el Parque Nacional Machalilla"

Mantén las respuestas concisas pero informativas.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en chat-support:', error);
    return new Response(JSON.stringify({ 
      error: 'Error procesando el mensaje. Por favor, contacta directamente a soporte.',
      reply: 'Lo siento, hay un problema técnico. Puedes contactarnos directamente en info@puertolopez.descubierto.com o al +593 2 123 4567 para asistencia inmediata.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
