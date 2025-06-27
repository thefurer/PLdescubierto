
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
  console.log('Chat support function called:', req.method, req.url)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: corsHeaders
      }
    )
  }

  try {
    console.log('Processing POST request')
    
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json()
      console.log('Request body received:', { hasMessage: !!requestBody?.message })
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON format',
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
      )
    }

    const { message } = requestBody
    console.log('Processing message:', message ? 'Message received' : 'No message')
    
    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('Invalid or empty message')
      return new Response(
        JSON.stringify({ 
          error: 'Message is required',
          reply: '¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.'
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      )
    }

    // Sanitize message
    const sanitizedMessage = message.trim().substring(0, 1000)
    console.log('Message sanitized, length:', sanitizedMessage.length)
    
    // Check for Google API key
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      console.error('Google API key not configured')
      return new Response(
        JSON.stringify({ 
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
      )
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

Responde de manera concisa y útil (máximo 300 palabras):`

    console.log('Calling Gemini API...')

    // Call Gemini API
    try {
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

      console.log('Gemini API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error: ${response.status} - ${errorText}`);
        
        return new Response(
          JSON.stringify({ 
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
        )
      }

      const data = await response.json();
      console.log('Gemini API response received successfully')
      
      let aiResponse = 'Lo siento, no pude procesar tu mensaje. Por favor contacta directamente con nosotros para obtener ayuda personalizada.';
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
        aiResponse = data.candidates[0].content.parts[0].text;
        console.log('AI response generated successfully')
      } else {
        console.warn('Unexpected Gemini API response structure')
      }

      // Log interaction for analytics
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        )

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
          })
        
        console.log('Interaction logged successfully')
      } catch (logError) {
        console.error('Failed to log interaction:', logError)
        // Don't fail the request if logging fails
      }

      return new Response(
        JSON.stringify({ reply: aiResponse }),
        { 
          headers: corsHeaders
        }
      )

    } catch (aiError) {
      console.error('AI service error:', aiError)
      
      return new Response(
        JSON.stringify({ 
          reply: `¡Hola! Gracias por contactarnos.

Hay un problema técnico temporal, pero puedes contactarnos directamente:

📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con tu viaje a Puerto López!` 
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      )
    }

  } catch (error) {
    console.error('General error in chat-support function:', error)
    
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
        status: 500, 
        headers: corsHeaders
      }
    )
  }
})
