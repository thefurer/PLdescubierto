
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

    const systemPrompt = `Eres un asistente de soporte especializado para Puerto López Descubierto, un sitio web de turismo en Puerto López, Ecuador. Tu función es proporcionar información detallada y útil a los visitantes.

INFORMACIÓN DE CONTACTO ACTUALIZADA:
- Email: ${contactInfo.email || 'info@puertolopez.descubierto.com'}
- Teléfono: ${contactInfo.phone || '+593 2 123 4567'}
- Dirección: ${contactInfo.address || 'Puerto López, Manabí, Ecuador'}

INFORMACIÓN TURÍSTICA DETALLADA:

MEJORES ÉPOCAS PARA VISITAR:
- TEMPORADA DE BALLENAS (Junio - Septiembre): Ideal para avistamiento de ballenas jorobadas
- TEMPORADA SECA (Junio - Noviembre): Clima más estable, menos lluvias
- TEMPORADA DE LLUVIAS (Diciembre - Mayo): Vegetación exuberante, menos turistas, precios más bajos

ACTIVIDADES TURÍSTICAS PRINCIPALES:
- Avistamiento de ballenas jorobadas (junio-septiembre)
- Excursión a la Isla de la Plata ("Galápagos de los pobres")
- Buceo y snorkeling en aguas cristalinas
- Senderismo en el Parque Nacional Machalilla
- Visita a Los Frailes (una de las playas más hermosas de Ecuador)
- Observación de aves (fragatas, piqueros, pelícanos)
- Pesca deportiva
- Tours a comunidades locales
- Kayak en manglares

CLIMA Y TEMPORADAS:
- Temperatura promedio: 24-28°C todo el año
- Temporada seca: Junio a Noviembre (menos humedad)
- Temporada lluviosa: Diciembre a Mayo (lluvias por las tardes)
- Agua del mar: 22-26°C ideal para actividades acuáticas
- Mejor visibilidad para buceo: Agosto a Octubre

DIRECTRICES DE RESPUESTA:
- Responde de manera amigable y profesional en español
- Proporciona información específica y detallada
- Para soporte técnico, deriva siempre a los contactos
- Sugiere actividades según la época del año
- Incluye precios aproximados cuando sea relevante
- Menciona recomendaciones de seguridad cuando sea necesario
- Si no tienes información específica, recomienda contactar directamente

EJEMPLOS DE RESPUESTAS ESTRUCTURADAS:
- Para información de contacto: Proporciona todos los datos de contacto disponibles
- Para épocas: Explica ventajas y desventajas de cada temporada
- Para actividades: Lista actividades con descripciones breves y recomendaciones
- Para clima: Incluye temperaturas, precipitaciones y mejores meses para actividades específicas
- Para soporte técnico: "Para problemas técnicos con nuestro sitio web o reservas, contacta directamente a ${contactInfo.email} o llama al ${contactInfo.phone}"

Mantén las respuestas informativas pero concisas. Usa emojis ocasionalmente para hacer las respuestas más amigables.`;

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
        max_tokens: 600,
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
