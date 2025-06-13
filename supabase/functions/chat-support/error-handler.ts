
import { CORS_HEADERS } from './constants.ts';

export function createErrorResponse(error: any, status: number = 500): Response {
  // Log error internally but don't expose sensitive details
  console.error('Error en chat-support - timestamp:', new Date().toISOString());
  
  const errorMessage = 'Lo siento, hay un problema técnico temporal.';
  const fallbackMessage = 'Lo siento, hay un problema técnico. Puedes contactarnos directamente:\n\n📞 +593 99 199 5390\n📞 +593 2 123 4567\n📧 apincay@gmail.com';

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
