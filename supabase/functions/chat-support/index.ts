import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { Database } from "./types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const CONTACT = {
  email: "apincay@gmail.com",
  whatsapp: "+593 99 199 5390",
  website: "https://www.whalexpeditionsecuador.com/",
};

serve(async (req) => {
  // 1) Preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 2) Solo POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Método no permitido",
        reply: "Solo se permiten solicitudes POST.",
      }),
      { status: 405, headers: corsHeaders }
    );
  }

  // 3) Leer body
  let text: string;
  try {
    text = await req.text();
    console.log("👉 Body recibido:", text);
  } catch (e) {
    console.error("Error leyendo body:", e);
    return new Response(
      JSON.stringify({
        error: "No se pudo leer la solicitud",
        reply:
          "Hubo un problema leyendo tu solicitud. Intenta de nuevo o contáctanos.",
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 4) Si body vacío, fallback
  if (!text.trim()) {
    return new Response(
      JSON.stringify({
        reply:
          "¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y con gusto te ayudo.",
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // 5) Parsear JSON
  let body: any;
  try {
    body = JSON.parse(text);
  } catch (e) {
    console.error("JSON inválido:", e);
    return new Response(
      JSON.stringify({
        error: "Formato inválido",
        reply: "No entendí tu solicitud. Por favor envía texto plano.",
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 6) Extraer y validar message
  const rawMsg = body.message;
  console.log("📨 Mensaje raw:", rawMsg);
  if (typeof rawMsg !== "string" || !rawMsg.trim()) {
    console.warn("Mensaje inválido o vacío:", rawMsg);
    return new Response(
      JSON.stringify({
        reply:
          "¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y con gusto te ayudo.",
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // 7) Sanitizar
  const sanitizedMessage = rawMsg.trim().substring(0, 1000);
  console.log("✅ Mensaje sanitizado:", sanitizedMessage);

  // 8) Verificar API key de Google
  const key = Deno.env.get("GOOGLE_API_KEY");
  if (!key) {
    console.error("Falta GOOGLE_API_KEY");
    return new Response(
      JSON.stringify({
        reply: `Nuestro asistente está en pausa.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}  
🔗 ${CONTACT.website}`,
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // 9) Preparar prompt
  const prompt = `Eres un asistente turístico de Puerto López, Ecuador.
Pregunta: ${sanitizedMessage}
Responde en español de forma amigable y profesional (máx. 200 palabras).`;

  // 10) Llamar a Gemini
  let aiRes: Response;
  try {
    aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 400,
          },
        }),
      }
    );
  } catch (e) {
    console.error("Error de red Gemini:", e);
    return new Response(
      JSON.stringify({
        reply: `Problema de conexión con la IA.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`,
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  if (!aiRes.ok) {
    const errTxt = await aiRes.text();
    console.error("Gemini API falló:", aiRes.status, errTxt);
    return new Response(
      JSON.stringify({
        reply: `Nuestro asistente tuvo un error técnico.  
📧 ${CONTACT.email}  
📱 ${CONTACT.whatsapp}`,
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // 11) Parse y extrae contenido
  let payload: any;
  try {
    payload = await aiRes.json();
  } catch (e) {
    console.error("JSON de Gemini inválido:", e);
  }
  const aiReply =
    payload?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Lo siento, no pude procesar tu mensaje.";

  console.log("🤖 Respuesta AI:", aiReply);

  // 12) (Opcional) log en Supabase
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
        timestamp: new Date().toISOString(),
      },
      change_type: "chat_message",
    });
  } catch (e) {
    console.error("Error log en Supabase:", e);
  }

  // 13) Devolver respuesta real
  return new Response(JSON.stringify({ reply: aiReply }), {
    status: 200,
    headers: corsHeaders,
  });
});
