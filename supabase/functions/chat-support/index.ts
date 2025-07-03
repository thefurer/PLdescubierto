import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const CONTACT = {
  email: 'apincay@gmail.com',
  whatsapp: '+593 99 199 5390',
  website: 'https://www.whalexpeditionsecuador.com/'
};

serve(async (req) => {
  // Manejo de CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Método no permitido',
        reply: 'Solo se permiten solicitudes POST.'
      }),
      { status: 405, headers: corsHeaders }
    );
  }

  // Leer rawText
  let rawText = '';
  try {
    rawText = await req.text();
    console.log('📥 Texto crudo recibido:', rawText);
  } catch (err) {
    console.error('❌ Error al leer el body:', err);
    return new Response(
      JSON.stringify({
        reply: 'No se pudo leer tu mensaje. Intenta de nuevo más tarde.'
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Fallback si body vacío
  if (!rawText.trim()) {
    return new Response(
      JSON.stringify({
        reply: '¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y estaré encantado de ayudarte.'
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Parsear JSON
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
  if (typeof message !== 'string' || !message.trim()) {
    console.warn('⚠️ Campo "message" inválido:', message);
    return new Response(
      JSON.stringify({
        reply: 'Por favor, formula una pregunta para poder ayudarte.'
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  const sanitizedMessage = message.trim().substring(0, 1000);
  console.log('📨 Mensaje recibido:', sanitizedMessage);

  // Validar API key
  const apiKey = Deno.env.get('GOOGLE_API_KEY');
  console.log('🔑 API Key presente:', !!apiKey);
  if (!apiKey) {
    console.error('❌ GOOGLE_API_KEY no está configurada');
    return new Response(
      JSON.stringify({
        reply: `Nuestro asistente está fuera de línea.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}  
🌐 ${CONTACT.website}`
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Preparar prompt
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

  // Llamada a Gemini
  let gRes: Response;
  try {
    gRes = await fetch(
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
    return new Response(
      JSON.stringify({
        reply: `Tuvimos un problema de conexión con la IA.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Verificar status HTTP
  if (!gRes.ok) {
    const errText = await gRes.text();
    console.error('❌ Gemini respondió con error HTTP:', gRes.status, errText);
    return new Response(
      JSON.stringify({
        reply: `Nuestro asistente no pudo procesar tu consulta por un problema técnico.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Parsear JSON de Gemini
  let result: any;
  try {
    result = await gRes.json();
    console.log('🔍 JSON recibido desde Gemini:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Error parseando respuesta JSON:', err);
    return new Response(
      JSON.stringify({
        reply: 'Ocurrió un error procesando la respuesta del asistente.'
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Extraer texto
  let aiReply = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!aiReply) {
    console.warn('⚠️ Respuesta inesperada o vacía desde Gemini. Usando fallback.');
    aiReply = `Puerto López es un paraíso costero ideal para avistar ballenas jorobadas de junio a septiembre. También puedes explorar Playa Los Frailes, Isla de la Plata y Agua Blanca.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`;
  }

  console.log('✅ Respuesta final enviada:', aiReply);

  // Guardar historial
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

  // Enviar respuesta al frontend
  return new Response(
    JSON.stringify({ reply: aiReply }),
    { status: 200, headers: corsHeaders }
  );
});
