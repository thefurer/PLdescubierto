
import { CORS_HEADERS } from './constants.ts';

export function createErrorResponse(error: any, status: number = 500): Response {
  console.error('Error en chat-support:', error);
  
  const errorMessage = error.message || 'Error procesando el mensaje.';
  const fallbackMessage = error.message || 'Lo siento, hay un problema técnico. Puedes contactarnos directamente en apincay@gmail.com o por WhatsApp al +593 99 199 5390 para asistencia inmediata.';

  return new Response(JSON.stringify({ 
    error: errorMessage,
    reply: fallbackMessage
  }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export function createSuccessResponse(reply: string): Response {
  return new Response(JSON.stringify({ reply }), {
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
