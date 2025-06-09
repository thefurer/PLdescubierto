
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limiting check (simple implementation)
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown'
    
    const { message, sessionId } = await req.json()
    
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
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Log the interaction for security monitoring
    await supabaseClient
      .from('content_history')
      .insert({
        section_name: 'chat_interaction',
        new_content: {
          message: sanitizedMessage,
          sessionId: sessionId,
          timestamp: new Date().toISOString(),
          clientIP: clientIP
        },
        change_type: 'chat_message'
      })

    // Simulate AI response (replace with actual AI integration)
    const response = {
      message: "Gracias por tu consulta sobre Puerto López. ¿En qué puedo ayudarte específicamente?",
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Chat support error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
