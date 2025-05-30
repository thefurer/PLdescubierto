
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CORS_HEADERS } from './constants.ts';
import { buildSystemPrompt } from './prompt-builder.ts';
import { GeminiClient } from './gemini-client.ts';
import { getContactInfo } from './database.ts';
import { createErrorResponse, createSuccessResponse } from './error-handler.ts';
import type { ChatRequest } from './types.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const { message }: ChatRequest = await req.json();
    console.log('Mensaje recibido:', message);
    
    const googleApiKey = 'AIzaSyDN3Ax3Y7sfs_efO4pWSpLi05oSRB4IKUg';

    if (!googleApiKey) {
      console.error('Google API Key no está configurada');
      throw new Error('Google API Key no está configurada');
    }

    // Obtener información de contacto actualizada desde la base de datos
    const contactInfo = await getContactInfo();

    const systemPrompt = buildSystemPrompt(contactInfo);
    const fullPrompt = `${systemPrompt}\n\nUsuario: ${message}\n\nAsistente:`;

    console.log('Enviando petición a Google Gemini...');
    
    const geminiClient = new GeminiClient(googleApiKey);
    const reply = await geminiClient.generateResponse(fullPrompt);
    
    console.log('Respuesta generada exitosamente');

    return createSuccessResponse(reply);

  } catch (error) {
    return createErrorResponse(error);
  }
});
