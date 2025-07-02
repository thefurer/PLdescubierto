import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { Database } from './types';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Credentials": "true",      // <-- añadido
  "Content-Type": "application/json"
};

const CONTACT_INFO = {
  email: "apincay@gmail.com",
  whatsapp: "+593 99 199 5390",
  website: "https://www.whalexpeditionsecuador.com/"
};

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname !== "/chat-support") {
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: corsHeaders
    });
  }

  // 1) Responde siempre a preflight CORS con 204 No Content
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // 2) Solo aceptamos POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Método no permitido",
        reply: "Solo se permiten solicitudes POST."
      }),
      { status: 405, headers: corsHeaders }
    );
  }

  // 3) Manejo principal del POST
  try {
    // 3a) Leer y parsear body
    const bodyText = await req.text();
    console.log("Raw bodyText:", bodyText);
    if (!bodyText.trim()) {
      return new Response(
        JSON.stringify({
          reply: "¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López."
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(bodyText);
    } catch (_e) {
      console.error("Error parseando JSON:", _e);
      return new Response(
        JSON.stringify({
          error: "Formato de solicitud inválido",
          reply: "Error en el formato de la solicitud. Por favor, intenta de nuevo."
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3b) Validar campo message
    const rawMsg = body.message;
    if (typeof rawMsg !== "string" || rawMsg.trim().length === 0) {
      console.warn("Message inválido o vacío:", rawMsg);
      return new Response(
        JSON.stringify({
          reply: "¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López."
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    const sanitizedMessage = rawMsg.trim().substring(0, 1000);
    console.log("Mensaje válido:", sanitizedMessage);

    // 3c) Revisar API key
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
    if (!googleApiKey) {
      console.error("Falta GOOGLE_API_KEY");
      return new Response(
        JSON.stringify({
          reply: `¡Hola! Nuestro asistente está temporalmente no disponible.  
📧 Email: ${CONTACT_INFO.email}  
📱 WhatsApp: ${CONTACT_INFO.whatsapp}  
🌐 Web: ${CONTACT_INFO.website}`
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3d) Construir prompt
    const prompt = `Eres un asistente turístico especializado en Puerto López, Ecuador.
Pregunta: ${sanitizedMessage}
Respuesta en español (máx.200 palabras):`;

    // 3e) Invocar Gemini
    let geminiRes: Response;
    try {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    } catch (networkErr) {
      console.error("Error de red Gemini:", networkErr);
      return new Response(
        JSON.stringify({
          reply: `¡Hay un problema de conexión con la IA!  
📧 ${CONTACT_INFO.email}  
📱 ${CONTACT_INFO.whatsapp}`
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return new Response(
        JSON.stringify({
          reply: `¡Nuestro asistente está experimentando problemas técnicos!  
📧 ${CONTACT_INFO.email}  
📱 ${CONTACT_INFO.whatsapp}`
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // 3f) Parsear y extraer respuesta
    let aiJson: any;
    try {
      aiJson = await geminiRes.json();
    } catch (jErr) {
      console.error("Error parseando JSON de Gemini:", jErr);
    }

    const aiReply =
      aiJson?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Lo siento, no pude procesar tu mensaje.";

    console.log("Respuesta AI:", aiReply);

    // 3g) (Opcional) Logueo en Supabase
    try {
      const supa = createClient<Database>(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );
      await supa.from("content_history").insert({
        section_name: "chat_interaction",
        new_content: {
          message: sanitizedMessage,
          response: aiReply,
          timestamp: new Date().toISOString()
        },
        change_type: "chat_message"
      });
    } catch (logErr) {
      console.error("Error al loguear en Supabase:", logErr);
    }

    // 3h) Devuelve la respuesta final
    return new Response(JSON.stringify({ reply: aiReply }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (err) {
    console.error("Error inesperado en POST:", err);
    return new Response(
      JSON.stringify({
        reply: `Lo siento, ocurrió un error inesperado.  
📧 ${CONTACT_INFO.email}`
      }),
      { status: 200, headers: corsHeaders }
    );
  }
});
