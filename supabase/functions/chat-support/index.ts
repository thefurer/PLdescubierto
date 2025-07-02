
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
        
        // Check if bodyText is empty first
        if (!bodyText.trim()) {
          console.log('Empty request body received');
          return createSuccessResponse('¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.');
        }

        // Try to parse JSON
        body = JSON.parse(bodyText);
        console.log('Parsed body successfully:', body);
        
        // Extract and validate message property
        message = body?.message;
        console.log('Extracted message:', message);
        
        // Validate message property specifically
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
          console.log('Invalid or empty message property:', message);
          return createSuccessResponse('¡Hola! 👋 Por favor, escribe tu pregunta y estaré encantado de ayudarte con información sobre Puerto López, Ecuador.');
        }

      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return createErrorResponse(parseError, 400);
      }
      
      console.log('Processing message:', message);
      
      const sanitizedMessage = message.trim().substring(0, 1000);
      console.log('Mensaje recibido:', sanitizedMessage);
      
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
      
      if (messageLower.includes('itinerario') || messageLower.includes('planificar') || messageLower.includes('personalizar')) {
        aiResponse = await handleItineraryRequest(sanitizedMessage, geminiClient);
      } else if (messageLower.includes('contacto') || messageLower.includes('teléfono') || messageLower.includes('whatsapp')) {
        aiResponse = await handleContactRequest(sanitizedMessage, geminiClient);
      } else if (messageLower.includes('época') || messageLower.includes('temporada') || messageLower.includes('cuándo')) {
        aiResponse = await handleSeasonsRequest(sanitizedMessage, geminiClient);
      } else if (messageLower.includes('actividades') || messageLower.includes('qué hacer') || messageLower.includes('tours')) {
        aiResponse = await handleActivitiesRequest(sanitizedMessage, geminiClient);
      } else if (messageLower.includes('clima') || messageLower.includes('tiempo') || messageLower.includes('lluvia')) {
        aiResponse = await handleWeatherRequest(sanitizedMessage, geminiClient);
      } else {
        aiResponse = await handleGeneralRequest(sanitizedMessage, geminiClient);
      }

      // Log interaction for analytics
      await logInteraction(sanitizedMessage, aiResponse);

      console.log('Sending successful response');
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
