
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

const CONTACT_INFO = {
  tourOperator: 'Whale Expeditions Tour - Ángel Pincay',
  email: 'apincay@gmail.com',
  website: 'https://www.whalexpeditionsecuador.com/',
  whatsapp: '+593 99 199 5390',
  location: 'Puerto López, Manabí, Ecuador'
};

serve(async (req) => {
  console.log('=== Chat Support Function Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return new Response(
      JSON.stringify({ 
        error: 'Method not allowed',
        reply: 'Solo se permiten solicitudes POST.'
      }),
      { 
        status: 405, 
        headers: corsHeaders
      }
    );
  }

  try {
    console.log('Processing POST request...');
    
    // Parse request body
    let requestBody;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      
      if (!bodyText) {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(bodyText);
      console.log('Parsed request body:', requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          reply: `Lo siento, hay un problema con el formato del mensaje.

📧 Contáctanos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte!`
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    const { message } = requestBody;
    console.log('User message:', message);
    
    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid or empty message');
      return new Response(
        JSON.stringify({ 
          error: 'Message is required',
          reply: '¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.'
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Sanitize message
    const sanitizedMessage = message.trim().substring(0, 1000);
    console.log('Sanitized message length:', sanitizedMessage.length);
    
    // Check for Google API key
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    console.log('Google API Key present:', !!googleApiKey);
    
    if (!googleApiKey) {
      console.error('Google API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured',
          reply: `¡Hola! Gracias por contactarnos. 

El servicio de chat automático no está disponible temporalmente, pero puedes contactarnos directamente:

📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con tu viaje a Puerto López!` 
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      );
    }

    // Create context prompt for Puerto López tourism
    const contextPrompt = `Eres un asistente turístico especializado en Puerto López, Ecuador.

Puerto López es un destino costero en la provincia de Manabí, Ecuador, conocido por:
- Observación de ballenas jorobadas (junio-septiembre, temporada alta)
- Parque Nacional Machalilla con senderos ecológicos
- Isla de la Plata (conocida como "Galápagos de los pobres")
- Playa Los Frailes (una de las más hermosas de Ecuador)
- Agua Blanca (sitio arqueológico y aguas termales)
- Ecoturismo y biodiversidad marina

INFORMACIÓN DE CONTACTO:
- Tour Operador: ${CONTACT_INFO.tourOperator}
- Email: ${CONTACT_INFO.email}
- WhatsApp: ${CONTACT_INFO.whatsapp}
- Sitio web: ${CONTACT_INFO.website}

INSTRUCCIONES:
- Responde en español de manera amigable y profesional
- Proporciona información práctica sobre actividades, hospedaje y transporte
- Para reservas específicas, dirige al usuario a contactar directamente
- Promociona el turismo sustentable y el respeto por la naturaleza

Pregunta del usuario: ${sanitizedMessage}

Responde de manera concisa y útil (máximo 300 palabras):`;

    console.log('Calling Gemini API...');

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    console.log('Gemini API response status:', geminiResponse.status);
    console.log('Gemini API response headers:', Object.fromEntries(geminiResponse.headers.entries()));

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'AI service error',
          reply: `¡Hola! Gracias por tu mensaje.

Hay un problema técnico temporal con nuestro asistente automático, pero puedes contactarnos directamente:

📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con información detallada sobre Puerto López!` 
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      );
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini API response data:', JSON.stringify(geminiData, null, 2));
    
    let aiResponse = 'Lo siento, no pude procesar tu mensaje. Por favor contacta directamente con nosotros para obtener ayuda personalizada.';
    
    if (geminiData.candidates && geminiData.candidates.length > 0 && 
        geminiData.candidates[0].content && geminiData.candidates[0].content.parts) {
      aiResponse = geminiData.candidates[0].content.parts[0].text;
      console.log('AI response generated successfully');
    } else {
      console.warn('Unexpected Gemini API response structure');
    }

    // Log interaction for analytics
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      );

      await supabaseClient
        .from('content_history')
        .insert({
          section_name: 'chat_interaction',
          new_content: {
            message: sanitizedMessage,
            response: aiResponse,
            timestamp: new Date().toISOString()
          },
          change_type: 'chat_message'
        });
      
      console.log('Interaction logged successfully');
    } catch (logError) {
      console.error('Failed to log interaction:', logError);
      // Don't fail the request if logging fails
    }

    console.log('Sending successful response');
    return new Response(
      JSON.stringify({ reply: aiResponse }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('General error in chat-support function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        reply: `Lo siento, ocurrió un error inesperado.

📧 Puedes contactarnos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte!` 
      }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
});
