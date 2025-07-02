
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { CORS_HEADERS, CONTACT_INFO } from './constants.ts';
import { GeminiClient } from './gemini-client.ts';
import { 
  handleItineraryRequest,
  handleContactRequest, 
  handleSeasonsRequest,
  handleActivitiesRequest,
  handleWeatherRequest,
  handleGeneralRequest,
  logInteraction
} from './message-handlers.ts';
import { createErrorResponse, createSuccessResponse } from './error-handler.ts';

serve(async (req) => {
  console.log('=== Chat Support Function Started ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response('ok', { 
      headers: CORS_HEADERS,
      status: 200 
    });
  }

  // Handle POST requests
  if (req.method === 'POST') {
    console.log('POST request received - processing...');
    
    try {
      // Parse request body with better error handling
      let body;
      let message;
      
      try {
        const bodyText = await req.text();
        console.log('Raw request body:', bodyText);
        console.log('Body text length:', bodyText.length);
        console.log('Body text trimmed length:', bodyText.trim().length);
        
        // Check if bodyText is completely empty
        if (bodyText.trim().length === 0) {
          console.log('VALIDATION: Empty request body - returning welcome message');
          return createSuccessResponse('¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.');
        }

        // Try to parse JSON
        body = JSON.parse(bodyText);
        console.log('Parsed body successfully:', body);
        
        // Extract message property
        message = body?.message;
        console.log('Extracted message:', message);
        console.log('Message type:', typeof message);
        
        // Validate message property specifically
        if (!message) {
          console.log('VALIDATION: Message property is missing/null/undefined - returning welcome message');
          return createSuccessResponse('¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.');
        }
        
        if (typeof message !== 'string') {
          console.log('VALIDATION: Message is not a string - returning welcome message');
          return createSuccessResponse('¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.');
        }
        
        if (message.trim().length === 0) {
          console.log('VALIDATION: Message is empty string after trimming - returning welcome message');
          return createSuccessResponse('¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.');
        }

        console.log('VALIDATION: Message is valid - proceeding with AI processing');

      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return createErrorResponse(parseError, 400);
      }
      
      const sanitizedMessage = message.trim().substring(0, 1000);
      console.log('Mensaje recibido para procesamiento:', sanitizedMessage);
      console.log('Sanitized message length:', sanitizedMessage.length);
      
      // Check for Google API key
      const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
      console.log('Google API Key available:', !!googleApiKey);
      
      if (!googleApiKey) {
        console.error('Google API key not found');
        const fallbackMessage = `¡Hola! Gracias por contactarnos.

Nuestro asistente automático no está disponible temporalmente, pero puedes contactarnos directamente:

📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: https://www.whalexpeditionsecuador.com/

¡Estaremos encantados de ayudarte con tu viaje a Puerto López!`;
        
        return createSuccessResponse(fallbackMessage);
      }

      const geminiClient = new GeminiClient(googleApiKey);
      let aiResponse: string;
      
      // Determine message type and handle accordingly
      const messageLower = sanitizedMessage.toLowerCase();
      console.log('Message categorization - processing:', messageLower.substring(0, 50) + '...');
      
      try {
        if (messageLower.includes('itinerario') || messageLower.includes('planificar') || messageLower.includes('personalizar')) {
          console.log('Categorized as: ITINERARY request');
          aiResponse = await handleItineraryRequest(sanitizedMessage, geminiClient);
        } else if (messageLower.includes('contacto') || messageLower.includes('teléfono') || messageLower.includes('whatsapp')) {
          console.log('Categorized as: CONTACT request');
          aiResponse = await handleContactRequest(sanitizedMessage, geminiClient);
        } else if (messageLower.includes('época') || messageLower.includes('temporada') || messageLower.includes('cuándo')) {
          console.log('Categorized as: SEASONS request');
          aiResponse = await handleSeasonsRequest(sanitizedMessage, geminiClient);
        } else if (messageLower.includes('actividades') || messageLower.includes('qué hacer') || messageLower.includes('tours')) {
          console.log('Categorized as: ACTIVITIES request');
          aiResponse = await handleActivitiesRequest(sanitizedMessage, geminiClient);
        } else if (messageLower.includes('clima') || messageLower.includes('tiempo') || messageLower.includes('lluvia')) {
          console.log('Categorized as: WEATHER request');
          aiResponse = await handleWeatherRequest(sanitizedMessage, geminiClient);
        } else {
          console.log('Categorized as: GENERAL request');
          aiResponse = await handleGeneralRequest(sanitizedMessage, geminiClient);
        }

        console.log('AI Response received, length:', aiResponse?.length || 0);
        
        // Second layer fallback for empty or invalid AI responses
        if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim().length === 0) {
          console.log('AI Response is empty or invalid - using dynamic fallback');
          aiResponse = `Gracias por tu pregunta sobre Puerto López. 

Te puedo ayudar con información sobre:
• Observación de ballenas (temporada junio-septiembre)
• Tours a Isla de la Plata
• Actividades en el Parque Nacional Machalilla
• Mejores épocas para visitar
• Recomendaciones de hospedaje y tours

Para asistencia personalizada inmediata:
📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}

¿Te gustaría que te ayude con algún tema específico?`;
        }

      } catch (aiError) {
        console.error('Error in AI processing:', aiError);
        aiResponse = `Disculpa, hubo un problema al procesar tu consulta sobre Puerto López.

Mientras tanto, puedes contactarnos directamente:
📧 Email: ${CONTACT_INFO.email}
📱 WhatsApp: ${CONTACT_INFO.whatsapp}
🌐 Web: https://www.whalexpeditionsecuador.com/

¡Estaremos encantados de ayudarte personalmente con información sobre tours, ballenas, actividades y todo lo que necesites para tu visita!`;
      }

      // Log interaction for analytics
      await logInteraction(sanitizedMessage, aiResponse);

      console.log('Sending successful response with AI content');
      return createSuccessResponse(aiResponse);

    } catch (error) {
      console.error('Unexpected error in POST handler:', error);
      return createErrorResponse(error, 500);
    }
  }

  // Handle other methods
  console.log('Method not allowed:', req.method);
  return createErrorResponse(new Error('Método no permitido'), 405);
});
