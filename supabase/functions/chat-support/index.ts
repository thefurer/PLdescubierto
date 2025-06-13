
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GeminiClient } from './gemini-client.ts'
import { createErrorResponse, createSuccessResponse } from './error-handler.ts'
import { validateMessage } from './validation.ts'
import { classifyMessage } from './message-classifier.ts'
import { 
  handleContactInfoRequest, 
  handleItineraryRequest, 
  handleSeasonInfoRequest, 
  handleActivitiesRequest 
} from './message-handlers.ts'

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
    
    // Validate and sanitize input
    const validation = validateMessage(message);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const sanitizedMessage = validation.sanitizedMessage!;
    
    // Classify message and handle predefined responses
    const messageType = classifyMessage(sanitizedMessage);
    
    switch (messageType) {
      case 'contact':
        return handleContactInfoRequest();
      case 'itinerary':
        return handleItineraryRequest();
      case 'season':
        return handleSeasonInfoRequest();
      case 'activities':
        return handleActivitiesRequest();
    }

    // Handle general AI responses
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      console.error('Google API key not found')
      return new Response(
        JSON.stringify({ 
          reply: 'Lo siento, el servicio de chat no está disponible en este momento. Puedes contactarnos directamente:\n\n📞 +593 99 199 5390\n📞 +593 2 123 4567\n📧 apincay@gmail.com' 
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

IMPORTANTE: 
- NUNCA uses etiquetas HTML como <strong>, <em>, <b>, etc. en tus respuestas
- Usa formato de texto plano con emojis y símbolos para dar énfasis
- Para texto destacado usa **texto** o MAYÚSCULAS
- Para listas usa • o números

Información de contacto oficial:
- Teléfonos: +593 99 199 5390 (WhatsApp), +593 2 123 4567
- Email: apincay@gmail.com
- Ubicación: Puerto López, Manabí, Ecuador
    
Puerto López es un destino costero en la provincia de Manabí, conocido por:
- Observación de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla
- Isla de la Plata (conocida como "Galápagos de los pobres")
- Playas hermosas como Los Frailes
- Agua Blanca (sitio arqueológico)
- Ecoturismo y naturaleza

Responde de manera amigable, informativa y útil. Proporciona información práctica sobre actividades, hospedaje, transporte y consejos para visitar Puerto López.

Pregunta del usuario: ${sanitizedMessage}

Responde en español de manera concisa y útil, SIN usar etiquetas HTML:`

    try {
      const aiResponse = await geminiClient.generateResponse(contextPrompt)
      
      // Clean any remaining HTML tags that might slip through
      const cleanResponse = aiResponse
        .replace(/<[^>]*>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
      
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
            response: cleanResponse,
            timestamp: new Date().toISOString()
          },
          change_type: 'chat_message'
        })

      return createSuccessResponse(cleanResponse)
    } catch (aiError) {
      console.error('AI service error:', aiError)
      
      return new Response(
        JSON.stringify({ 
          reply: 'Lo siento, hay un problema técnico temporal. Puedes contactarnos directamente:\n\n📞 +593 99 199 5390\n📞 +593 2 123 4567\n📧 apincay@gmail.com' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Chat support error:', error)
    
    return createErrorResponse(error)
  }
})
