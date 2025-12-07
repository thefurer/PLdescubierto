import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, analyticsContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres un asistente experto en análisis de datos turísticos para Puerto López, Ecuador. Tu nombre es "Analytics Assistant" y ayudas a los administradores a entender y mejorar las calificaciones de las atracciones turísticas.

CONTEXTO DE DATOS ACTUALES:
${JSON.stringify(analyticsContext, null, 2)}

INSTRUCCIONES:
- Responde SIEMPRE en español
- Sé conversacional, amigable y profesional
- Usa emojis de forma moderada para hacer las respuestas más visuales
- Proporciona insights accionables y recomendaciones específicas
- Si te preguntan sobre una atracción específica, busca en los datos del contexto
- Formatea las respuestas con Markdown para mejor legibilidad
- Si no tienes datos específicos sobre algo, dilo honestamente
- Para métricas, siempre incluye números concretos del contexto
- Sugiere próximos pasos o preguntas relacionadas al final de tus respuestas

CAPACIDADES:
- Análisis de rendimiento de atracciones
- Identificación de tendencias y patrones
- Recomendaciones de mejora personalizadas
- Generación de insights sobre anomalías y alertas
- Comparaciones entre atracciones
- Sugerencias de estrategias de marketing
- Planes de acción detallados

FORMATO DE RESPUESTA:
- Usa encabezados en negrita (**texto**)
- Listas con viñetas para información estructurada
- Emojis relevantes al inicio de secciones
- Máximo 400 palabras por respuesta para mantener claridad`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Por favor, intenta de nuevo más tarde." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Por favor, recarga tu cuenta de Lovable AI." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error al conectar con el servicio de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Analytics chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
