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
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return new Response(JSON.stringify({ error: "Mensaje vacío o inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Eres un asistente turístico amigable y experto en Puerto López, Ecuador. Tu nombre es "Asistente Puerto López".

INFORMACIÓN CLAVE SOBRE PUERTO LÓPEZ:
- Ubicación: Costa de Manabí, Ecuador
- Temporada de ballenas jorobadas: Junio a Septiembre
- Atracciones principales:
  • Parque Nacional Machalilla (entrada $5 adultos)
  • Isla de la Plata ("Galápagos de los pobres") - piqueros de patas azules, fragatas
  • Playa Los Frailes - una de las más hermosas del Ecuador
  • Comunidad Agua Blanca - sitio arqueológico y laguna de azufre
- Actividades: Avistamiento de ballenas, snorkeling, buceo, tours ecológicos
- Gastronomía: Mariscos frescos, ceviche, encebollado, corviche
- Clima: Tropical, cálido todo el año (25-30°C)

INSTRUCCIONES:
- Responde siempre en español
- Sé amigable, entusiasta y servicial
- Mantén respuestas concisas (máximo 150 palabras)
- Usa emojis ocasionalmente para hacer las respuestas más visuales
- NO menciones operadores turísticos específicos ni información de contacto
- Para reservas, sugiere buscar en línea o visitar la oficina de turismo local
- Si no sabes algo específico, sé honesto y sugiere fuentes de información`;

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
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Por favor, intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Servicio temporalmente no disponible." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error al conectar con el asistente" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat support error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
