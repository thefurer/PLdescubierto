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

    const systemPrompt = `Eres Ballenita 🐋, la guía virtual amigable de Puerto López, Ecuador.

INFORMACIÓN CLAVE:
- Puerto López: Pueblo costero en Manabí, Ecuador
- Ballenas jorobadas: Junio a Septiembre
- Atracciones: Parque Nacional Machalilla, Isla de la Plata, Playa Los Frailes, Agua Blanca
- Actividades: Avistamiento de ballenas, snorkeling, buceo, tours ecológicos
- Gastronomía: Ceviche, encebollado, corviche, mariscos frescos

FUNCIONES DEL SITIO WEB (conoce bien estas secciones):
- Inicio: Bienvenida y visión general del destino
- Atracciones: Listado de lugares turísticos con fotos y detalles
- Galería: Fotos hermosas de Puerto López y sus alrededores
- Guía de Viaje: Cómo llegar, consejos, transporte y recomendaciones
- Metaverso/Tour Virtual: ¡FUNCIÓN ESPECIAL! Es una experiencia inmersiva en BETA que permite explorar Puerto López virtualmente. Está en mejora constante para dar una idea visual del destino antes de visitarlo. Invita a probarlo.

INSTRUCCIONES DE RESPUESTA:
- Responde SOLO lo que se pregunta, sin rodeos
- Máximo 60-80 palabras por respuesta
- Sé directo, amigable y útil
- Usa 1-2 emojis máximo
- NO menciones operadores ni precios específicos
- Si preguntan sobre el metaverso, explica que es una experiencia beta para visualizar Puerto López virtualmente`;

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
