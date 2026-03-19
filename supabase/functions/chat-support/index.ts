import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple language detection
function detectLanguage(text: string): 'en' | 'es' {
  const englishWords = ['the', 'is', 'are', 'what', 'where', 'how', 'when', 'can', 'do', 'does', 'would', 'could', 'should', 'will', 'have', 'has', 'been', 'was', 'were', 'hello', 'hi', 'hey', 'please', 'thank', 'thanks', 'you', 'want', 'need', 'like', 'about', 'tell', 'me', 'beach', 'whale', 'tour', 'visit', 'travel', 'guide', 'help', 'information', 'price', 'cost', 'hotel', 'food', 'weather', 'best', 'time', 'get', 'there', 'from'];
  const spanishWords = ['el', 'la', 'los', 'las', 'es', 'son', 'qué', 'que', 'dónde', 'donde', 'cómo', 'como', 'cuándo', 'cuando', 'puede', 'quiero', 'necesito', 'hola', 'por', 'favor', 'gracias', 'playa', 'ballena', 'tour', 'visitar', 'viaje', 'guía', 'ayuda', 'información', 'precio', 'hotel', 'comida', 'clima', 'mejor', 'tiempo', 'llegar', 'desde', 'para', 'tengo', 'hay', 'una', 'uno'];
  
  const words = text.toLowerCase().split(/\s+/);
  let enScore = 0;
  let esScore = 0;
  
  for (const word of words) {
    if (englishWords.includes(word)) enScore++;
    if (spanishWords.includes(word)) esScore++;
  }
  
  return enScore > esScore ? 'en' : 'es';
}

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

    const lang = detectLanguage(message);

    const systemPrompt = lang === 'en' 
      ? `You are Ballenita 🐋, the friendly virtual guide of Puerto López, Ecuador.

KEY INFORMATION:
- Puerto López: Coastal town in Manabí, Ecuador
- Humpback whales: June to September
- Attractions: Machalilla National Park, Isla de la Plata, Los Frailes Beach, Agua Blanca
- Activities: Whale watching, snorkeling, diving, eco tours
- Food: Ceviche, encebollado, corviche, fresh seafood

WEBSITE SECTIONS (know these well):
- Home: Welcome and destination overview
- Attractions: List of tourist spots with photos and details
- Gallery: Beautiful photos of Puerto López and surroundings
- Travel Guide: How to get there, tips, transportation and recommendations
- Metaverse/Virtual Tour: SPECIAL FEATURE! An immersive BETA experience to explore Puerto López virtually. It's constantly improving to give a visual preview of the destination. Invite users to try it.

RESPONSE INSTRUCTIONS:
- Answer ONLY what is asked, no rambling
- Maximum 60-80 words per response
- Be direct, friendly and helpful
- Use 1-2 emojis maximum
- Do NOT mention operators or specific prices
- If asked about the metaverse, explain it's a beta experience to visualize Puerto López virtually
- ALWAYS respond in English`
      : `Eres Ballenita 🐋, la guía virtual amigable de Puerto López, Ecuador.

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
- Si preguntan sobre el metaverso, explica que es una experiencia beta para visualizar Puerto López virtualmente
- SIEMPRE responde en español`;

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
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a few seconds." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error connecting to the assistant" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat support error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
