
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { CORS_HEADERS, CONTACT_INFO } from './constants.ts';
import { GeminiClient } from './gemini-client.ts';
import { createErrorResponse, createSuccessResponse } from './error-handler.ts';
import type { Database } from "./types.ts";

serve(async (req) => {
  console.log(`🚀 [${new Date().toISOString()}] ${req.method} request received`);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("✅ CORS preflight request handled");
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log(`❌ Method ${req.method} not allowed`);
    return new Response(
      JSON.stringify({ error: "Método no permitido", reply: "Solo se permiten solicitudes POST." }),
      { status: 405, headers: CORS_HEADERS }
    );
  }

  // Read and validate request body
  let bodyText: string;
  try {
    bodyText = await req.text();
    console.log('📩 Body recibido (raw):', bodyText);
  } catch (e) {
    console.error('❌ Error leyendo body:', e);
    return createErrorResponse(
      "No se pudo leer la solicitud",
      400
    );
  }

  // Check if body is empty
  if (!bodyText || !bodyText.trim()) {
    console.log('⚠️ Body vacío detectado');
    return createSuccessResponse(
      "¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y con gusto te ayudo."
    );
  }

  // Parse JSON body
  let parsedBody: any;
  try {
    parsedBody = JSON.parse(bodyText);
    console.log('📦 Body parseado:', parsedBody);
  } catch (e) {
    console.error('❌ Error parseando JSON:', e);
    return createErrorResponse(
      "Formato de mensaje inválido. Intenta de nuevo.",
      400
    );
  }

  // Extract and validate message field
  const rawMessage = parsedBody?.message;
  console.log('🔍 Campo message extraído:', { type: typeof rawMessage, value: rawMessage });

  // Validate message exists and is a non-empty string
  if (typeof rawMessage !== 'string' || !rawMessage.trim()) {
    console.log('⚠️ Mensaje inválido o vacío - devolviendo bienvenida');
    return createSuccessResponse(
      "¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y con gusto te ayudo."
    );
  }

  // Sanitize message
  const sanitizedMessage = rawMessage.trim().substring(0, 1000);
  console.log('📩 Mensaje sanitizado:', sanitizedMessage);

  // Check Google API key
  const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!googleApiKey) {
    console.error('❌ GOOGLE_API_KEY no configurada');
    return createSuccessResponse(`Nuestro asistente turístico está en mantenimiento temporal.

Mientras tanto, puedes contactarnos directamente:
📧 ${CONTACT_INFO.email}
📱 ${CONTACT_INFO.whatsapp}
🌐 ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con información sobre Puerto López!`);
  }

  // Build specialized prompt for Puerto López tourism
  const touristPrompt = `Eres un asistente turístico especializado en Puerto López, Ecuador, y la región de Manabí.

CONTEXTO ESPECÍFICO:
- Puerto López es famoso por el avistamiento de ballenas jorobadas (junio-septiembre)
- Parque Nacional Machalilla con playas como Los Frailes
- Isla de la Plata (conocida como "pequeñas Galápagos")
- Cultura local, gastronomía marina, actividades de ecoturismo
- Mejor época de visita, tours disponibles, hospedaje recomendado

PREGUNTA DEL VISITANTE: ${sanitizedMessage}

INSTRUCCIONES:
1. Responde específicamente sobre Puerto López y sus atractivos
2. Sé informativo pero conciso (máximo 300 palabras)
3. Incluye recomendaciones prácticas cuando sea relevante
4. Mantén un tono amigable y profesional
5. Si la pregunta no es sobre turismo, redirige educadamente hacia temas turísticos locales

Responde en español:`;

  try {
    // Call Gemini API
    const geminiClient = new GeminiClient(googleApiKey);
    const aiResponse = await geminiClient.generateResponse(touristPrompt);
    
    console.log('🤖 Respuesta de Gemini recibida:', aiResponse);

    // Validate AI response
    if (!aiResponse || typeof aiResponse !== 'string' || !aiResponse.trim()) {
      console.log('⚠️ Respuesta de Gemini vacía o inválida');
      
      // Dynamic fallback based on common tourism questions
      let fallbackResponse = '';
      const lowerMessage = sanitizedMessage.toLowerCase();
      
      if (lowerMessage.includes('ballena') || lowerMessage.includes('whale')) {
        fallbackResponse = `🐋 ¡Excelente pregunta sobre las ballenas en Puerto López!

La temporada de avistamiento de ballenas jorobadas es de **junio a septiembre**, siendo julio y agosto los mejores meses. Durante este período, miles de ballenas migran desde la Antártida para reproducirse en aguas ecuatorianas.

**Tours disponibles:**
• Excursiones de medio día (3-4 horas)
• Tours completos con visita a Isla de la Plata
• Salidas diarias desde el malecón de Puerto López

📞 Contacta con nosotros para más detalles:
${CONTACT_INFO.whatsapp} | ${CONTACT_INFO.email}`;
      } else if (lowerMessage.includes('playa') || lowerMessage.includes('beach')) {
        fallbackResponse = `🏖️ Puerto López cuenta con hermosas playas cercanas:

**Los Frailes** - Considerada una de las playas más bellas del Ecuador, ubicada en el Parque Nacional Machalilla.

**Playa de Puerto López** - El malecón principal, ideal para caminatas y contemplar atardeceres.

**La Playita** - Playa más pequeña y tranquila, perfecta para relajarse.

**Cómo llegar:** Tours organizados o transporte público desde Puerto López.

¿Te interesa conocer más sobre actividades playeras? 🌊`;
      } else {
        fallbackResponse = `¡Hola! Soy tu asistente turístico de Puerto López 🌊

Como especialista en esta hermosa región costera de Ecuador, puedo ayudarte con:
• 🐋 Avistamiento de ballenas (temporada: junio-septiembre)
• 🏝️ Tours a Isla de la Plata
• 🏖️ Playas como Los Frailes
• 🍽️ Gastronomía local y mariscos frescos
• 🏨 Recomendaciones de hospedaje

¿Qué aspecto de Puerto López te interesa más conocer?`;
      }
      
      return createSuccessResponse(fallbackResponse);
    }

    // Log successful interaction to Supabase (optional)
    try {
      const supabase = createClient<Database>(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      );
      
      await supabase.from("content_history").insert({
        section_name: "chat_interaction",
        new_content: {
          message: sanitizedMessage,
          response: aiResponse,
          timestamp: new Date().toISOString(),
        },
        change_type: "chat_message",
      });
    } catch (dbError) {
      console.error('⚠️ Error logging to Supabase (no afecta funcionalidad):', dbError);
    }

    console.log('✅ Respuesta exitosa enviada al cliente');
    return createSuccessResponse(aiResponse);
    
  } catch (error: any) {
    console.error('❌ Error en procesamiento:', error);
    
    // Provide helpful fallback based on error type
    let errorResponse = '';
    if (error.message?.includes('429')) {
      errorResponse = `El asistente está ocupado atendiendo muchas consultas. 

Mientras tanto, aquí tienes información básica sobre Puerto López:
🐋 Temporada de ballenas: Junio - Septiembre
🏖️ Playa Los Frailes: Una de las más bellas del Ecuador
🏝️ Isla de la Plata: Tours de día completo disponibles

📞 Para consultas inmediatas: ${CONTACT_INFO.whatsapp}`;
    } else {
      errorResponse = `Disculpa, tengo dificultades técnicas momentáneas.

📧 Contacto directo: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}

¡Estaremos encantados de ayudarte con información sobre Puerto López!`;
    }
    
    return createSuccessResponse(errorResponse);
  }
});
