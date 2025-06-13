
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GeminiClient } from './gemini-client.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; object-src 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    
    // Input validation and sanitization
    if (!message || typeof message !== 'string' || message.length > 1000) {
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
    
    // Get Google API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      console.error('Google API key not found')
      return new Response(
        JSON.stringify({ 
          reply: 'Lo siento, el servicio de chat no está disponible en este momento. Puedes contactarnos directamente en apincay@gmail.com o al +593 99 199 5390.' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Gemini client
    const geminiClient = new GeminiClient(googleApiKey)
    
    // Create context-aware prompt for Puerto López
    const contextPrompt = `Eres un asistente turístico especializado en Puerto López, Ecuador. 
    
Puerto López es un destino costero en la provincia de Manabí, conocido por:
- Observación de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla
- Isla de la Plata (conocida como "Galápagos de los pobres")
- Playas hermosas como Los Frailes
- Agua Blanca (sitio arqueológico)
- Ecoturismo y naturaleza

Responde de manera amigable, informativa y útil. Proporciona información práctica sobre actividades, hospedaje, transporte y consejos para visitar Puerto López.

Pregunta del usuario: ${sanitizedMessage}

Responde en español de manera concisa y útil:`

    try {
      const aiResponse = await geminiClient.generateResponse(contextPrompt)
      
      // Log interaction for monitoring
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
          reply: 'Lo siento, hay un problema técnico temporal. Puedes contactarnos directamente en apincay@gmail.com o al +593 99 199 5390.' 
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
        reply: 'Lo siento, ocurrió un error. Puedes contactarnos directamente en apincay@gmail.com o al +593 99 199 5390.' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
