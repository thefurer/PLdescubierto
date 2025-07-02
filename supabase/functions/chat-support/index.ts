import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const CONTACT = {
  email: 'apincay@gmail.com',
  whatsapp: '+593 99 199 5390',
  website: 'https://www.whalexpeditionsecuador.com/'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido', reply: 'Solo se permiten solicitudes POST.' }),
      { status: 405, headers: corsHeaders }
    );
  }

  let rawText = '';
  try {
    rawText = await req.text();
    console.log('📥 Texto crudo recibido:', rawText);
  } catch (err) {
    console.error('❌ Error al leer el body:', err);
    return new Response(
      JSON.stringify({ reply: 'No se pudo leer tu mensaje. Intenta de nuevo más tarde.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  if (!rawText.trim()) {
    return new Response(JSON.stringify({
      reply: '¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y estaré encantado de ayudarte.'
    }), { status: 200, headers: corsHeaders });
  }

  let body: any;
  try {
    body = JSON.parse(rawText);
  } catch (err) {
    console.error('❌ Body no es JSON válido:', err);
    return new Response(
      JSON.stringify({
        reply: 'Hubo un error interpretando tu mensaje. Asegúrate de que sea texto plano.'
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { message } = body;
  if (typeof message !== 'string' || message.trim().length === 0) {
    console.warn('⚠️ Campo "message" inválido:', message);
    return new Response(JSON.stringify({
      reply: 'Por favor, formula una pregunta para poder ayudarte.'
    }), { status: 200, headers: corsHeaders });
  }

  const sanitizedMessage = message.trim().substring(0, 1000);
  console.log('📨 Mensaje recibido:', sanitizedMessage);

  const apiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({
      reply: `Nuestro asistente está fuera de línea.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}  
🌐 ${CONTACT.website}`
    }), { status: 200, headers: corsHeaders });
  }

  const prompt = `Eres un asistente turístico especializado en Puerto López, Ecuador.

Puerto López es un destino costero en Manabí, Ecuador, conocido por:
- Observación de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla
- Isla de la Plata ("Galápagos de los pobres")
- Playa Los Frailes
- Agua Blanca (sitio arqueológico)
- Ecoturismo marino

Operador: Whale Expeditions Tour - Ángel Pincay
Email: ${CONTACT.email}
WhatsApp: ${CONTACT.whatsapp}
Web: ${CONTACT.website}

Responde en español de manera amigable y profesional. Para reservas específicas, dirige al usuario a contactar directamente.

Pregunta: ${sanitizedMessage}

Responde de manera concisa (máximo 200 palabras):`;

  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 400
          }
        })
      }
    );
  } catch (err) {
    console.error('❌ Error al llamar a Gemini:', err);
    return new Response(JSON.stringify({
      reply: `Tuvimos un problema de conexión con la IA.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`
    }), { status: 200, headers: corsHeaders });
  }

  let result;
  try {
    result = await response.json();
    console.log('🔍 Respuesta completa de Gemini:', JSON.stringify(result));
  } catch (err) {
    console.error('❌ Error parseando la respuesta de Gemini:', err);
    return new Response(JSON.stringify({
      reply: 'No pudimos procesar la respuesta de la IA. Escríbenos directamente si necesitas ayuda.'
    }), { status: 200, headers: corsHeaders });
  }

  let aiReply = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!aiReply) {
    console.warn('⚠️ Respuesta vacía de Gemini. Usando fallback...');
    aiReply = `Puerto López es un destino turístico en la costa de Manabí, Ecuador. Entre junio y septiembre puedes observar ballenas jorobadas. También puedes visitar Isla de la Plata, Playa Los Frailes y Agua Blanca.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`;
  }

  try {
    const client = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    await client.from('content_history').insert({
      section_name: 'chat_interaction',
      new_content: {
        message: sanitizedMessage,
        response: aiReply,
        timestamp: new Date().toISOString()
      },
      change_type: 'chat_message'
    });
  } catch (logErr) {
    console.error('❌ No se pudo guardar el historial:', logErr);
  }

  return new Response(JSON.stringify({ reply: aiReply }), {
    status: 200,
    headers: corsHeaders
  });
});
