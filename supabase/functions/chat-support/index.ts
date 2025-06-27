
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
}

const CONTACT_INFO = {
  email: 'apincay@gmail.com',
  whatsapp: '+593 99 199 5390',
  website: 'https://www.whalexpeditionsecuador.com/'
};

serve(async (req) => {
  console.log('=== Chat Support Function Started ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
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
    const body = await req.json();
    console.log('Request body:', body);
    
    const { message } = body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('Invalid message provided');
      return new Response(
        JSON.stringify({ 
          reply: '¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.'
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      );
    }

    const sanitizedMessage = message.trim().substring(0, 1000);
    console.log('Sanitized message:', sanitizedMessage);
    
    // Check for Google API key
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    console.log('Google API Key available:', !!googleApiKey);
    
    if (!googleApiKey) {
      console.error('Google API key not found');
      return new Response(
        JSON.stringify({ 
          reply: `¡Hola! Gracias por contactarnos.

Nuestro asistente automático no está disponible temporalmente, pero puedes contactarnos directamente:

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

    // Create context for Puerto López tourism
    const prompt = `Eres un asistente turístico especializado en Puerto López, Ecuador.

Puerto López es un destino costero en Manabí, Ecuador, conocido por:
- Observación de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla
- Isla de la Plata ("Galápagos de los pobres")
- Playa Los Frailes
- Agua Blanca (sitio arqueológico)
- Ecoturismo marino

Operador: Whale Expeditions Tour - Ángel Pincay
Email: ${CONTACT_INFO.email}
WhatsApp: ${CONTACT_INFO.whatsapp}
Web: ${CONTACT_INFO.website}

Responde en español de manera amigable y profesional. Para reservas específicas, dirige al usuario a contactar directamente.

Pregunta: ${sanitizedMessage}

Responde de manera concisa (máximo 200 palabras):`;

    console.log('Calling Google Gemini API...');

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    console.log('Gemini API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          reply: `¡Hola! Gracias por tu mensaje.

Tenemos un problema técnico temporal con nuestro asistente, pero puedes contactarnos directamente:

📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte!` 
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      );
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    let aiResponse = 'Lo siento, no pude procesar tu mensaje. Por favor contacta directamente con nosotros.';
    
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts) {
      aiResponse = data.candidates[0].content.parts[0].text;
      console.log('AI response generated successfully');
    } else {
      console.warn('Unexpected API response structure');
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
    } catch (logError) {
      console.error('Failed to log interaction:', logError);
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
    console.error('Error in chat-support function:', error);
    
    return new Response(
      JSON.stringify({ 
        reply: `Lo siento, ocurrió un error inesperado.

📧 Puedes contactarnos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte!` 
      }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
  }
});
