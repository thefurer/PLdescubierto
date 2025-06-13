
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
    
    // Check for specific queries and provide enhanced responses
    const lowerMessage = sanitizedMessage.toLowerCase()
    
    // Enhanced contact information response
    if (lowerMessage.includes('contacto') || lowerMessage.includes('información de contacto') || 
        lowerMessage.includes('telefono') || lowerMessage.includes('teléfono') || 
        lowerMessage.includes('email') || lowerMessage.includes('correo')) {
      
      const contactResponse = `📞 **Información de Contacto - Puerto López Descubierto**

**Teléfonos:**
• +593 99 199 5390 (WhatsApp disponible)
• +593 2 123 4567

**Email:**
• apincay@gmail.com
• info@whalexpeditionsecuador.com

**Ubicación:**
Puerto López, Manabí, Ecuador

¡Estamos disponibles para ayudarte a planificar tu aventura perfecta en Puerto López! Puedes contactarnos por cualquiera de estos medios.`

      return new Response(
        JSON.stringify({ reply: contactResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Enhanced itinerary customization response
    if (lowerMessage.includes('itinerario') || lowerMessage.includes('personalizar') || 
        lowerMessage.includes('planificar') || lowerMessage.includes('viaje')) {
      
      const itineraryResponse = `🗓️ **Personalización de Itinerario - Puerto López**

Para crear tu itinerario perfecto, necesito conocer algunos detalles:

**¿Cuántos días tienes disponibles?**
Esto define la cantidad de actividades que podemos incluir:
• 1-2 días: Actividades principales (ballenas + playa)
• 3-4 días: Tour completo con Isla de la Plata
• 5+ días: Experiencia inmersiva con múltiples destinos

**¿Cuál es tu presupuesto aproximado?**
• Económico: $50-80 por día
• Moderado: $80-120 por día  
• Premium: $120+ por día

**¿Qué te interesa más?**
• Avistamiento de ballenas (junio-septiembre)
• Buceo y snorkeling
• Senderismo y naturaleza
• Cultura y gastronomía local
• Playas y relajación

**¿Cuántas personas son?**
Esto nos ayuda a personalizar el transporte y actividades grupales.

Una vez que me proporciones esta información, podré crear un itinerario detallado y personalizado para tu visita a Puerto López. 

¿Por dónde te gustaría empezar? 😊`

      return new Response(
        JSON.stringify({ reply: itineraryResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get Google API key from environment
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
- Email: apincay@gmail.com, info@whalexpeditionsecuador.com
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

      return new Response(
        JSON.stringify({ reply: cleanResponse }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
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
    
    return new Response(
      JSON.stringify({ 
        reply: 'Lo siento, ocurrió un error. Puedes contactarnos directamente:\n\n📞 +593 99 199 5390\n📞 +593 2 123 4567\n📧 apincay@gmail.com' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
