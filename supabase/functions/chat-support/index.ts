
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}

const CONTACT_INFO = {
  tourOperator: 'Whale Expeditions Tour - Ángel Pincay',
  email: 'apincay@gmail.com',
  website: 'https://www.whalexpeditionsecuador.com/',
  whatsapp: '+593 99 199 5390',
  location: 'Puerto López, Manabí, Ecuador'
};

const WHATSAPP_LINK = 'https://wa.me/593991995390?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López';

serve(async (req) => {
  console.log('Chat support function called with method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Received message:', message)
    
    // Input validation and sanitization
    if (!message || typeof message !== 'string' || message.length > 1000) {
      console.error('Invalid message format or length')
      return new Response(
        JSON.stringify({ error: 'Invalid message format or length' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Sanitize input
    const sanitizedMessage = message.trim().substring(0, 1000)
    console.log('Sanitized message:', sanitizedMessage)
    
    // Get Google API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      console.error('Google API key not found')
      return new Response(
        JSON.stringify({ 
          reply: `Lo siento, el servicio de chat no está disponible en este momento. 

📧 Puedes contactarnos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con tu viaje a Puerto López!` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create context-aware prompt for Puerto López
    const contextPrompt = `Eres un asistente turístico especializado en Puerto López, Ecuador. 

Puerto López es un destino costero en la provincia de Manabí, conocido por:
- Observación de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla
- Isla de la Plata (conocida como "Galápagos de los pobres")
- Playas hermosas como Los Frailes
- Agua Blanca (sitio arqueológico)
- Ecoturismo y naturaleza

INFORMACIÓN DE CONTACTO IMPORTANTE:
- Tour Operador: ${CONTACT_INFO.tourOperator}
- Email: ${CONTACT_INFO.email}
- WhatsApp: ${CONTACT_INFO.whatsapp}
- Sitio web: ${CONTACT_INFO.website}

Responde de manera amigable, informativa y útil. Proporciona información práctica sobre actividades, hospedaje, transporte y consejos para visitar Puerto López.

Si te piden información de contacto, proporciona los datos del tour operador Whale Expeditions Tour.

Pregunta del usuario: ${sanitizedMessage}

Responde en español de manera concisa y útil. NO uses asteriscos, palabras strong, ni formato especial:`

    console.log('Making request to Gemini API...')

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
        console.error(`Google Gemini API error: ${response.status} - ${errorText}`);
        
        let fallbackMessage = `Lo siento, hay un problema técnico temporal.

📧 Puedes contactarnos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con tu viaje a Puerto López!`

        if (response.status === 429) {
          fallbackMessage = 'El servicio de IA está temporalmente sobrecargado. Por favor, intenta de nuevo en unos momentos.';
        } else if (response.status === 401 || response.status === 403) {
          fallbackMessage = 'Error de autenticación con el servicio de IA de Google.';
        }
        
        return new Response(
          JSON.stringify({ reply: fallbackMessage }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const data = await response.json();
      console.log('Gemini API response data:', JSON.stringify(data, null, 2))
      
      let aiResponse = 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.';
      
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts) {
        aiResponse = data.candidates[0].content.parts[0].text;
      }

      console.log('Final AI response:', aiResponse)
      
      // Log interaction for monitoring
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
      } catch (logError) {
        console.error('Failed to log interaction:', logError)
        // Don't fail the request if logging fails
      }

      return new Response(
        JSON.stringify({ reply: aiResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } catch (aiError) {
      console.error('AI service error:', aiError)
      
      return new Response(
        JSON.stringify({ 
          reply: `Lo siento, hay un problema técnico temporal.

📧 Puedes contactarnos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con tu viaje a Puerto López!` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Chat support error:', error)
    
    return new Response(
      JSON.stringify({ 
        reply: `Lo siento, ocurrió un error.

📧 Puedes contactarnos directamente:
• Email: ${CONTACT_INFO.email}
• WhatsApp: ${CONTACT_INFO.whatsapp}
• Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte!` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
