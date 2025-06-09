
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

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

const validateName = (name: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/.test(name.trim())
}

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, message } = await req.json()
    
    // Input validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son requeridos' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Formato de email inválido' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate name format
    if (!validateName(name)) {
      return new Response(
        JSON.stringify({ error: 'Formato de nombre inválido' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Length validation
    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'El mensaje es demasiado largo' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email.toLowerCase()),
      message: sanitizeInput(message)
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Store the contact form submission securely
    const { error } = await supabaseClient
      .from('content_history')
      .insert({
        section_name: 'contact_form',
        new_content: {
          ...sanitizedData,
          timestamp: new Date().toISOString(),
          clientIP: req.headers.get('x-forwarded-for') || 'unknown'
        },
        change_type: 'contact_submission'
      })

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Error al procesar el formulario' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Formulario enviado correctamente' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
