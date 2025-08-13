import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Contact info removed as requested by user

interface RequestBody {
  message: string;
  sessionId?: string;
}

const sanitizeMessage = (message: string): string => {
  return message
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\u00C0-\u017F.,;:¿?¡!()@+-]/g, '')
    .trim()
    .substring(0, 1000);
};

const generatePrompt = (message: string): string => {
  return `Eres un asistente turístico especializado en Puerto López, Ecuador.

INFORMACIÓN CLAVE:
- Puerto López: Costa de Manabí, Ecuador
- Temporada de ballenas: Junio a Septiembre
- Atracciones: Parque Nacional Machalilla, Isla de la Plata, Playa Los Frailes, Agua Blanca
- Actividades: Avistamiento de ballenas, snorkeling, tours ecológicos, arqueología
- Gastronomía: Mariscos frescos, ceviche, encebollado
- Hospedaje: Hoteles boutique, hostales, cabañas frente al mar

INSTRUCCIONES IMPORTANTES:
- Responde en español, máximo 100 palabras
- Sé directo y preciso, evita información redundante
- NO menciones operadores turísticos específicos
- NO incluyas información de contacto de empresas
- Para reservas, sugiere buscar "tours Puerto López" o contactar la oficina de turismo local
- Enfócate en información práctica y útil

PREGUNTA: ${message}

Respuesta breve y precisa:`;
};

const callGemini = async (prompt: string, apiKey: string): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.6,
          topK: 30,
          topP: 0.9,
          maxOutputTokens: 200
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Gemini API Error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const result = await response.json();
  const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  
  if (!generatedText) {
    throw new Error('No se pudo generar respuesta válida');
  }

  return generatedText;
};

const logInteraction = async (userMessage: string, botResponse: string, source: string = 'unknown') => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { error } = await supabase.from('content_history').insert({
      section_name: 'chat_interaction',
      new_content: {
        user_message: userMessage,
        bot_response: botResponse,
        response_source: source,
        timestamp: new Date().toISOString(),
        session_type: 'chatbot'
      },
      change_type: 'chat_message'
    });

    if (error) {
      console.error('❌ Error logging interaction:', error);
    } else {
      console.log('✅ Interaction logged successfully');
    }
  } catch (err) {
    console.error('❌ Failed to log interaction:', err);
  }
};

serve(async (req) => {
  console.log(`📨 ${req.method} request received at ${new Date().toISOString()}`);
  console.log('🔧 Function is operational and responding');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled');
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log('❌ Invalid method:', req.method);
    return new Response(
      JSON.stringify({ 
        error: 'Method not allowed',
        reply: 'Solo se permiten solicitudes POST.' 
      }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    // Read request body
    const rawText = await req.text();
    console.log('📥 Raw request body received. Length:', rawText.length);
    console.log('📥 Request content preview:', rawText.substring(0, 200));

    if (!rawText || !rawText.trim()) {
      console.log('⚠️ Empty request body detected - this should not happen for valid messages');
      return new Response(
        JSON.stringify({ 
          reply: 'Error: No se recibió ningún mensaje. Por favor, intenta escribir tu pregunta de nuevo.',
          source: 'validation_error'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Parse JSON
    let requestData: RequestBody;
    try {
      requestData = JSON.parse(rawText);
      console.log('📋 Successfully parsed request data:', {
        messageLength: requestData.message?.length || 0,
        hasSessionId: !!requestData.sessionId,
        messagePreview: requestData.message?.substring(0, 50) || 'N/A'
      });
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ 
          reply: 'Error en el formato del mensaje. Por favor, intenta de nuevo.' 
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate message
    const { message } = requestData;
    console.log('🔍 Validating message:', { 
      messageType: typeof message, 
      messageLength: message?.length || 0,
      isTruthy: !!message,
      trimmedLength: message?.trim()?.length || 0
    });
    
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.log('⚠️ Invalid message detected:', { message, type: typeof message });
      return new Response(
        JSON.stringify({ 
          reply: 'Error: El mensaje está vacío o no es válido. Por favor, escribe una pregunta sobre Puerto López.',
          source: 'validation_error'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Sanitize message
    const sanitizedMessage = sanitizeMessage(message);
    console.log('🧹 Message sanitization:', {
      originalLength: message.length,
      sanitizedLength: sanitizedMessage.length,
      wasModified: message !== sanitizedMessage
    });
    
    if (!sanitizedMessage) {
      console.log('⚠️ Message became empty after sanitization');
      return new Response(
        JSON.stringify({ 
          reply: 'El mensaje contiene caracteres no válidos. Por favor, usa solo texto simple sin caracteres especiales.',
          source: 'sanitization_error'
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('✅ Message validation passed. Sanitized message:', sanitizedMessage);

    // Usar API key integrada
    const apiKey = 'AIzaSyCjkYre7PNuHbmKDLs6EqzMZuuI37GTKTU';
    console.log('🔑 Google API Key configurada directamente en el código');

    // Generate response with Gemini
    let botResponse: string;
    let responseSource = 'gemini';
    
    try {
      const prompt = generatePrompt(sanitizedMessage);
      console.log('🤖 Calling Gemini API with prompt length:', prompt.length);
      console.log('🎯 Prompt preview:', prompt.substring(0, 200) + '...');
      
      botResponse = await callGemini(prompt, apiKey);
      console.log('✅ Gemini response received successfully');
      console.log('📝 Response preview:', botResponse.substring(0, 100) + '...');
      responseSource = 'gemini';
    } catch (geminiError) {
      console.error('❌ Gemini error:', geminiError);
      
      // Provide contextual fallback based on message content
      const lowerMessage = sanitizedMessage.toLowerCase();
      if (lowerMessage.includes('ballena') || lowerMessage.includes('whale')) {
        botResponse = `🐋 Temporada de ballenas jorobadas: Junio a Septiembre. Puerto López es el mejor punto de partida para este avistamiento. Los tours salen desde el malecón temprano en la mañana.`;
      } else if (lowerMessage.includes('isla') || lowerMessage.includes('plata')) {
        botResponse = `🏝️ Isla de la Plata: Conocida como "Galápagos de los pobres". Piqueros de patas azules, fragatas y excelente snorkeling. Tours de día completo disponibles desde Puerto López.`;
      } else if (lowerMessage.includes('contacto') || lowerMessage.includes('información')) {
        botResponse = `📍 Para tours en Puerto López busca "tours Puerto López" en línea o visita la oficina de turismo local en el malecón. Hay múltiples operadores disponibles.`;
      } else if (lowerMessage.includes('playa') || lowerMessage.includes('frailes')) {
        botResponse = `🏖️ Playa Los Frailes: Considerada una de las más hermosas del Ecuador. Parte del Parque Nacional Machalilla, agua cristalina y arena dorada. Acceso gratuito.`;
      } else if (lowerMessage.includes('machalilla')) {
        botResponse = `🌿 Parque Nacional Machalilla: Bosque seco tropical, senderos ecológicos, Agua Blanca (sitio arqueológico) y playas vírgenes. Entrada: $5 adultos.`;
      } else {
        botResponse = `Puerto López, Manabí: Destino ecuatoriano famoso por ballenas jorobadas (Jun-Sep), Isla de la Plata, Playa Los Frailes y Parque Nacional Machalilla. Base ideal para ecoturismo marino.`;
      }
      responseSource = 'fallback';
    }

    // Log the interaction with source information
    await logInteraction(sanitizedMessage, botResponse, responseSource);

    console.log(`✅ Sending response to user. Source: ${responseSource}, Length: ${botResponse.length}`);
    return new Response(
      JSON.stringify({ 
        reply: botResponse,
        source: responseSource
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    
    const errorResponse = `Lo siento, ocurrió un error técnico. Por favor, intenta de nuevo en unos momentos o busca información turística en el malecón de Puerto López.`;

    return new Response(
      JSON.stringify({ reply: errorResponse }),
      { status: 500, headers: corsHeaders }
    );
  }
});
