import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { CORS_HEADERS, CONTACT_INFO } from './constants.ts';
import { GeminiClient } from './gemini-client.ts';
import { createErrorResponse, createSuccessResponse } from './error-handler.ts';
import { 
  handleItineraryRequest, 
  handleContactRequest, 
  handleSeasonsRequest, 
  handleActivitiesRequest, 
  handleWeatherRequest, 
  handleGeneralRequest,
  logInteraction 
} from './message-handlers.ts';

interface RequestBody {
  message: string;
  sessionId?: string;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  sanitizedInput?: string;
}

const validateRequest = (rawText: string): ValidationResult => {
  if (!rawText.trim()) {
    return { isValid: false, message: '¡Hola! 👋 Por favor, escribe tu pregunta sobre Puerto López y estaré encantado de ayudarte.' };
  }

  let body: RequestBody;
  try {
    body = JSON.parse(rawText);
  } catch (err) {
    console.error('❌ JSON parse error:', err);
    return { isValid: false, message: 'Formato de mensaje inválido. Por favor, intenta de nuevo.' };
  }

  const { message } = body;
  if (typeof message !== 'string' || !message.trim()) {
    return { isValid: false, message: 'Por favor, incluye un mensaje válido en tu consulta.' };
  }

  // Sanitización robusta
  const sanitized = message
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s\u00C0-\u017F.,;:¿?¡!()@+-]/g, '')
    .trim()
    .substring(0, 1000);

  if (!sanitized) {
    return { isValid: false, message: 'El mensaje contiene caracteres no válidos. Intenta con texto simple.' };
  }

  return { isValid: true, sanitizedInput: sanitized };
};

const classifyMessage = (message: string): string => {
  const lower = message.toLowerCase();
  
  if (lower.includes('itinerario') || lower.includes('plan') || lower.includes('ruta') || lower.includes('días')) {
    return 'itinerary';
  }
  if (lower.includes('contacto') || lower.includes('teléfono') || lower.includes('email') || lower.includes('información')) {
    return 'contact';
  }
  if (lower.includes('temporada') || lower.includes('época') || lower.includes('cuando') || lower.includes('mes')) {
    return 'seasons';
  }
  if (lower.includes('actividad') || lower.includes('tour') || lower.includes('hacer') || lower.includes('ballena')) {
    return 'activities';
  }
  if (lower.includes('clima') || lower.includes('tiempo') || lower.includes('lluvia') || lower.includes('temperatura')) {
    return 'weather';
  }
  
  return 'general';
};

serve(async (req) => {
  const startTime = Date.now();
  
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return createErrorResponse('Método no permitido. Use POST.', 405);
  }

  try {
    // Leer y validar request body
    const rawText = await req.text();
    console.log('📥 Request recibido:', rawText.substring(0, 200));
    
    const validation = validateRequest(rawText);
    if (!validation.isValid) {
      return createSuccessResponse(validation.message!);
    }

    const sanitizedMessage = validation.sanitizedInput!;
    console.log('📨 Mensaje sanitizado:', sanitizedMessage);

    // Verificar API key
    const apiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!apiKey) {
      console.error('❌ GOOGLE_API_KEY no configurada');
      const fallbackMsg = `El asistente está temporalmente fuera de línea. 
📧 Contacto: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: ${CONTACT_INFO.website}`;
      return createSuccessResponse(fallbackMsg);
    }

    // Inicializar cliente de Gemini
    const geminiClient = new GeminiClient(apiKey);
    
    // Clasificar mensaje y procesarlo
    const messageType = classifyMessage(sanitizedMessage);
    console.log('🏷️ Tipo de mensaje clasificado:', messageType);
    
    let response: string;
    
    try {
      switch (messageType) {
        case 'itinerary':
          response = await handleItineraryRequest(sanitizedMessage, geminiClient);
          break;
        case 'contact':
          response = await handleContactRequest(sanitizedMessage, geminiClient);
          break;
        case 'seasons':
          response = await handleSeasonsRequest(sanitizedMessage, geminiClient);
          break;
        case 'activities':
          response = await handleActivitiesRequest(sanitizedMessage, geminiClient);
          break;
        case 'weather':
          response = await handleWeatherRequest(sanitizedMessage, geminiClient);
          break;
        default:
          response = await handleGeneralRequest(sanitizedMessage, geminiClient);
      }
    } catch (geminiError) {
      console.error('❌ Error en Gemini:', geminiError);
      
      // Respuesta específica basada en el tipo de consulta
      switch (messageType) {
        case 'contact':
          response = `📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Website: ${CONTACT_INFO.website}
📍 Ubicación: ${CONTACT_INFO.location}`;
          break;
        case 'activities':
          response = `🐋 Principales actividades en Puerto López:
• Avistamiento de ballenas (junio-septiembre)
• Tour a Isla de la Plata
• Visita a Playa Los Frailes
• Exploración de Agua Blanca
• Snorkeling y buceo

Para más información: ${CONTACT_INFO.whatsapp}`;
          break;
        default:
          response = `Puerto López te ofrece experiencias únicas como avistamiento de ballenas, Isla de la Plata y Playa Los Frailes.

Para información detallada contacta:
📱 ${CONTACT_INFO.whatsapp}
📧 ${CONTACT_INFO.email}`;
      }
    }

    // Registrar interacción en base de datos
    await logInteraction(sanitizedMessage, response);
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ Respuesta generada en ${processingTime}ms`);
    
    return createSuccessResponse(response);

  } catch (error) {
    console.error('❌ Error general:', error);
    return createErrorResponse(error, 500);
  }
});
