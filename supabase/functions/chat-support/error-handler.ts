
import { CORS_HEADERS, CONTACT_INFO } from './constants.ts';

export function createErrorResponse(error: any, status: number = 500): Response {
  // Log error internally but don't expose sensitive details
  console.error('Error en chat-support - timestamp:', new Date().toISOString());
  
  const errorMessage = 'Lo siento, hay un problema técnico temporal.';
  const fallbackMessage = `Lo siento, hay un problema técnico. Puedes contactarnos directamente en ${CONTACT_INFO.email} o por WhatsApp al ${CONTACT_INFO.whatsapp} para asistencia inmediata.`;

  return new Response(JSON.stringify({ 
    error: errorMessage,
    reply: fallbackMessage
  }), {
    status,
    headers: CORS_HEADERS,
  });
}

export function createSuccessResponse(reply: string): Response {
  return new Response(JSON.stringify({ reply }), {
    headers: CORS_HEADERS,
  });
}
