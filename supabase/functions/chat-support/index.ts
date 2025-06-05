
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
    
    // Input validation - prevent XSS and injection attacks
    if (!message || typeof message !== 'string') {
      throw new Error('Mensaje inválido');
    }
    
    // Sanitize message - remove potentially dangerous characters and limit length
    const sanitizedMessage = message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .substring(0, 1000)
      .trim();
    
    if (!sanitizedMessage) {
      throw new Error('El mensaje no puede estar vacío');
    }

    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!googleApiKey) {
      console.error('Google API Key no está configurada en los secrets de Supabase');
      throw new Error('Configuración del servicio no disponible');
    }

    // Obtener información de contacto actualizada desde la base de datos
    const contactInfo = await getContactInfo();

    const systemPrompt = buildSystemPrompt(contactInfo);
    const fullPrompt = `${systemPrompt}\n\nUsuario: ${sanitizedMessage}\n\nAsistente:`;

    const geminiClient = new GeminiClient(googleApiKey);
    const reply = await geminiClient.generateResponse(fullPrompt);
    
    // Sanitize the AI response as well to prevent XSS
    const sanitizedReply = reply
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();

    return createSuccessResponse(sanitizedReply);

  } catch (error) {
    return createErrorResponse(error);
  }
});
