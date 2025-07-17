import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const CONTACT_INFO = {
  email: 'apincay@gmail.com',
  whatsapp: '+593 99 199 5390',
  website: 'https://www.whalexpeditionsecuador.com/'
};

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

INFORMACIÓN CLAVE sobre Puerto López:
- Ubicación: Costa de Manabí, Ecuador
- Mejor época para ballenas: Junio a Septiembre
- Atracciones principales: Parque Nacional Machalilla, Isla de la Plata, Playa Los Frailes, Agua Blanca
- Actividades: Avistamiento de ballenas, snorkeling, tours ecológicos, arqueología

OPERADOR TURÍSTICO:
- Empresa: Whale Expeditions Tour - Ángel Pincay
- Email: ${CONTACT_INFO.email}
- WhatsApp: ${CONTACT_INFO.whatsapp}
- Web: ${CONTACT_INFO.website}

INSTRUCCIONES:
- Responde en español de manera amigable y profesional
- Máximo 200 palabras por respuesta
- Para reservas específicas, dirige al usuario a contactar directamente
- Incluye información práctica y útil sobre Puerto López

PREGUNTA DEL USUARIO: ${message}

Respuesta:`;
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500
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

    // Check API key
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    console.log('🔑 Google API Key status:', {
      isConfigured: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT_SET'
    });
    
    if (!apiKey) {
      console.error('❌ GOOGLE_API_KEY not configured in Supabase secrets');
      const fallbackResponse = `🤖 El asistente de IA está temporalmente fuera de línea (API key no configurada).

Para información sobre Puerto López, contacta directamente:
📧 ${CONTACT_INFO.email}
📱 ${CONTACT_INFO.whatsapp}
🌐 ${CONTACT_INFO.website}

Mientras tanto, te puedo decir que Puerto López es famoso por el avistamiento de ballenas jorobadas de junio a septiembre.`;
      
      await logInteraction(sanitizedMessage, fallbackResponse);
      return new Response(
        JSON.stringify({ 
          reply: fallbackResponse,
          source: 'api_key_missing'
        }),
        { status: 200, headers: corsHeaders }
      );
    }

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
        botResponse = `🐋 La temporada de avistamiento de ballenas jorobadas en Puerto López es de junio a septiembre. Es una experiencia única que no te puedes perder.

Para tours especializados contacta:
📱 ${CONTACT_INFO.whatsapp}
📧 ${CONTACT_INFO.email}`;
      } else if (lowerMessage.includes('isla') || lowerMessage.includes('plata')) {
        botResponse = `🏝️ La Isla de la Plata, conocida como "Galápagos de los pobres", es una de las principales atracciones de Puerto López. Puedes ver piqueros de patas azules, fragatas y hacer snorkeling.

Para más información:
📱 ${CONTACT_INFO.whatsapp}
📧 ${CONTACT_INFO.email}`;
      } else if (lowerMessage.includes('contacto') || lowerMessage.includes('información')) {
        botResponse = `📍 Información de contacto para tours en Puerto López:

🏢 Whale Expeditions Tour - Ángel Pincay
📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}`;
      } else {
        botResponse = `Puerto López es un destino increíble en la costa ecuatoriana, famoso por el avistamiento de ballenas jorobadas y la hermosa Isla de la Plata.

Para planificar tu visita:
📱 ${CONTACT_INFO.whatsapp}
📧 ${CONTACT_INFO.email}
🌐 ${CONTACT_INFO.website}`;
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
    
    const errorResponse = `Lo siento, ocurrió un error técnico. Por favor, intenta de nuevo o contacta directamente:

📧 ${CONTACT_INFO.email}
📱 ${CONTACT_INFO.whatsapp}`;

    return new Response(
      JSON.stringify({ reply: errorResponse }),
      { status: 500, headers: corsHeaders }
    );
  }
});
